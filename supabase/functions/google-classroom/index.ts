
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { agentId, action, courseId, data } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    const accessToken = Deno.env.get('GOOGLE_ACCESS_TOKEN')
    
    if (!googleApiKey || !accessToken) {
      throw new Error('Google API credentials not configured')
    }

    let result = {}

    switch (action) {
      case 'createCourse':
        result = await createCourse(accessToken, data)
        break
      case 'postAnnouncement':
        result = await postAnnouncement(accessToken, courseId, data)
        break
      case 'createAssignment':
        result = await createAssignment(accessToken, courseId, data)
        break
      case 'getCourses':
        result = await getCourses(accessToken)
        break
      case 'getStudents':
        result = await getStudents(accessToken, courseId)
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    console.log(`Google Classroom action ${action} completed by agent ${agentId}`)

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Google Classroom integration error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function createCourse(accessToken: string, courseData: any) {
  const response = await fetch('https://classroom.googleapis.com/v1/courses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: courseData.name,
      description: courseData.description,
      ownerId: 'me',
      courseState: 'ACTIVE',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create course: ${response.statusText}`)
  }

  return await response.json()
}

async function postAnnouncement(accessToken: string, courseId: string, announcementData: any) {
  const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: announcementData.text,
      state: 'PUBLISHED',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to post announcement: ${response.statusText}`)
  }

  return await response.json()
}

async function createAssignment(accessToken: string, courseId: string, assignmentData: any) {
  const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: assignmentData.title,
      description: assignmentData.description,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
      maxPoints: assignmentData.maxPoints || 100,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create assignment: ${response.statusText}`)
  }

  return await response.json()
}

async function getCourses(accessToken: string) {
  const response = await fetch('https://classroom.googleapis.com/v1/courses', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get courses: ${response.statusText}`)
  }

  return await response.json()
}

async function getStudents(accessToken: string, courseId: string) {
  const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/students`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get students: ${response.statusText}`)
  }

  return await response.json()
}
