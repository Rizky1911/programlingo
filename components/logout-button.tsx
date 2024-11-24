//import { LogOut } from 'lucide-react';
import React from 'react'
import { SignOut } from '@/lib/actions/auth-actions';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  return (
    <div>
        <form action={async () => {
          await SignOut();
          location.reload();
        }}>
            <Button type= "submit" variant="outline" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
            {/* <button
            type= "submit"
            className={'flex flex-wrap items-center justify-between h-auto w-56 bottom-0 rounded-md'}
            >
            
            <span className="flex">Sign Out</span>
            <div className="flex items-center px-8 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <LogOut/>
            </div>
            
            </button> */}
        </form>
    </div>
  )
}
