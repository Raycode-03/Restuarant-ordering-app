import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

type EmailOtpType = 'signup' | 'invite' | 'magiclink' | 'recovery' | 'email_change'

export async function GET(request: NextRequest) {
  console.log('🔍 CONFIRM ROUTE HIT')
  
  const { searchParams, origin } = new URL(request.url)
  
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'
  
  // Log what we received
  console.log('📥 Received params:', {
    code,
    token_hash,
    type,
    next,
    fullUrl: request.url
  })
  
  const supabase = await createClient()

  // Handle new PKCE flow
  if (code) {
    console.log('✅ Using PKCE flow with code')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('PKCE Result:', { data, error })
    
    if (!error) {
      console.log('✅ PKCE Success! Redirecting to:', next)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('❌ PKCE Error:', error)
    }
  }

  // Handle old token_hash flow
  if (token_hash && type) {
    console.log('✅ Using OTP flow with token_hash')
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    console.log('OTP Result:', { data, error })
    
    if (!error) {
      console.log('✅ OTP Success! Redirecting to:', next)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('❌ OTP Error:', error)
    }
  }

  console.error('❌ No valid params found, redirecting to error page')
  return NextResponse.redirect(`${origin}/error`)
}