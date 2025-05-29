
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const { agentId, phoneNumber, message, userId } = await req.json()

    // Validation
    if (!agentId || !phoneNumber || !message) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields (agentId, phoneNumber, message)' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user has SMS enabled
    const { data: settings, error: settingsError } = await supabase
      .from('sms_settings')
      .select('enabled')
      .eq('user_id', userId)
      .single()

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('Error fetching SMS settings:', settingsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch SMS settings' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // If user has no settings or has disabled SMS, log this but don't send
    if (!settings || !settings.enabled) {
      console.log('SMS messaging is disabled for this user')
      
      // Still create a record but mark as not sent
      await supabase
        .from('sms_messages')
        .insert({
          user_id: userId,
          agent_id: agentId,
          phone_number: phoneNumber,
          message_content: message,
          direction: 'outbound',
          status: 'cancelled',
          error_message: 'SMS notifications are disabled by user'
        })

      return new Response(
        JSON.stringify({ success: false, message: 'SMS notifications are disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // In production, integrate with Twilio here
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER')
    
    let smsResult
    let smsStatus = 'sent'
    let errorMessage = null
    let twilioSid = null
    
    // If we have Twilio credentials, send a real SMS
    if (twilioAccountSid && twilioAuthToken && twilioFromNumber) {
      try {
        // Format the phone number (ensure it has +1 for US numbers)
        const formattedPhone = phoneNumber.replace(/\D/g, '')
        const phoneWithCountryCode = formattedPhone.startsWith('1') 
          ? `+${formattedPhone}` 
          : `+1${formattedPhone}`

        // Send SMS with Twilio API
        const twilioResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
            },
            body: new URLSearchParams({
              From: twilioFromNumber,
              To: phoneWithCountryCode,
              Body: message
            })
          }
        )
        
        if (!twilioResponse.ok) {
          const twilioError = await twilioResponse.json()
          throw new Error(twilioError.message || 'Twilio API error')
        }
        
        const twilioData = await twilioResponse.json()
        smsStatus = twilioData.status
        twilioSid = twilioData.sid
        smsResult = twilioData
        
      } catch (twilioError) {
        console.error('Twilio SMS error:', twilioError)
        smsStatus = 'failed'
        errorMessage = twilioError.message
        smsResult = { error: twilioError.message }
      }
    } else {
      // Simulate SMS for development (no actual SMS sent)
      smsStatus = 'simulated'
      twilioSid = `sim_${Date.now()}`
      console.log('SIMULATED SMS:', { to: phoneNumber, message, from: agentId })
      smsResult = { simulated: true, to: phoneNumber, message }
    }

    // Record the SMS in the database
    const { data: smsRecord, error: smsError } = await supabase
      .from('sms_messages')
      .insert({
        user_id: userId,
        agent_id: agentId,
        phone_number: phoneNumber,
        message_content: message,
        direction: 'outbound',
        status: smsStatus,
        error_message: errorMessage,
        twilio_sid: twilioSid,
        delivered_at: smsStatus === 'delivered' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (smsError) {
      console.error('Error saving SMS record:', smsError)
    }

    // Return result
    return new Response(
      JSON.stringify({ 
        success: smsStatus !== 'failed', 
        status: smsStatus,
        message: `SMS ${smsStatus === 'failed' ? 'failed' : 'processed successfully'}`,
        smsId: smsRecord?.id || null, 
        result: smsResult 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error sending SMS:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
