//import { LogOut } from 'lucide-react';
import React from 'react'
import { SignOut } from '@/lib/actions/auth-actions';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export const LogoutButtonMobile = () => {
  return (
    <div>
        <form action={async () => {
          await SignOut();
          location.reload();
        }}>
            <Button 
              type= "submit" 
              variant="ghost"
                        className="w-full justify-start px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-primary/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
        </form>
    </div>
  )
}
