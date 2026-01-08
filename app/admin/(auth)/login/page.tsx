import React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import {Card} from "@/components/ui/card";
function page() {
  return (
    
    <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full max-w-sm max-w-[90%] md:max-w-sm">
          <div><LoginForm/></div>
        </Card>
    </div>
  )
}

export default page