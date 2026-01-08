import React from 'react'
import { Card } from '@/components/ui/card'
import { SignUpForm } from '@/components/auth/Signupform'
function page() {
  return (
    <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-sm max-w-[90%] md:max-w-sm">
          <div><SignUpForm/></div>
        </Card>
    </div>
  )
}

export default page