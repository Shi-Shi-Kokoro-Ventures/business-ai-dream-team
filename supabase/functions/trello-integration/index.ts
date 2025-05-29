
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
    const { agentId, action, boardId, listId, cardId, data } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const trelloApiKey = Deno.env.get('TRELLO_API_KEY')
    const trelloToken = Deno.env.get('TRELLO_TOKEN')
    
    if (!trelloApiKey || !trelloToken) {
      throw new Error('Trello API credentials not configured')
    }

    const baseUrl = `https://api.trello.com/1`
    const authParams = `key=${trelloApiKey}&token=${trelloToken}`

    let result = {}

    switch (action) {
      case 'createBoard':
        result = await createBoard(baseUrl, authParams, data)
        break
      case 'createList':
        result = await createList(baseUrl, authParams, boardId, data)
        break
      case 'createCard':
        result = await createCard(baseUrl, authParams, listId, data)
        break
      case 'updateCard':
        result = await updateCard(baseUrl, authParams, cardId, data)
        break
      case 'addComment':
        result = await addComment(baseUrl, authParams, cardId, data)
        break
      case 'getBoards':
        result = await getBoards(baseUrl, authParams)
        break
      case 'getBoardLists':
        result = await getBoardLists(baseUrl, authParams, boardId)
        break
      case 'getListCards':
        result = await getListCards(baseUrl, authParams, listId)
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    console.log(`Trello action ${action} completed by agent ${agentId}`)

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Trello integration error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function createBoard(baseUrl: string, authParams: string, boardData: any) {
  const response = await fetch(`${baseUrl}/boards?${authParams}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: boardData.name,
      desc: boardData.description,
      defaultLists: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create board: ${response.statusText}`)
  }

  return await response.json()
}

async function createList(baseUrl: string, authParams: string, boardId: string, listData: any) {
  const response = await fetch(`${baseUrl}/lists?${authParams}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: listData.name,
      idBoard: boardId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create list: ${response.statusText}`)
  }

  return await response.json()
}

async function createCard(baseUrl: string, authParams: string, listId: string, cardData: any) {
  const response = await fetch(`${baseUrl}/cards?${authParams}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: cardData.name,
      desc: cardData.description,
      idList: listId,
      due: cardData.dueDate,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create card: ${response.statusText}`)
  }

  return await response.json()
}

async function updateCard(baseUrl: string, authParams: string, cardId: string, updateData: any) {
  const response = await fetch(`${baseUrl}/cards/${cardId}?${authParams}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update card: ${response.statusText}`)
  }

  return await response.json()
}

async function addComment(baseUrl: string, authParams: string, cardId: string, commentData: any) {
  const response = await fetch(`${baseUrl}/cards/${cardId}/actions/comments?${authParams}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: commentData.text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add comment: ${response.statusText}`)
  }

  return await response.json()
}

async function getBoards(baseUrl: string, authParams: string) {
  const response = await fetch(`${baseUrl}/members/me/boards?${authParams}`)

  if (!response.ok) {
    throw new Error(`Failed to get boards: ${response.statusText}`)
  }

  return await response.json()
}

async function getBoardLists(baseUrl: string, authParams: string, boardId: string) {
  const response = await fetch(`${baseUrl}/boards/${boardId}/lists?${authParams}`)

  if (!response.ok) {
    throw new Error(`Failed to get board lists: ${response.statusText}`)
  }

  return await response.json()
}

async function getListCards(baseUrl: string, authParams: string, listId: string) {
  const response = await fetch(`${baseUrl}/lists/${listId}/cards?${authParams}`)

  if (!response.ok) {
    throw new Error(`Failed to get list cards: ${response.statusText}`)
  }

  return await response.json()
}
