"use client"

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import Link from "next/link"
import { useState, useTransition } from "react"
import { LoginSchema } from '@/schemas';
import { Login } from '@/lib/actions/auth-actions';
import { AtSign, KeyRound } from 'lucide-react';
import { FormError } from './form-error';
import { FormSuccess } from './form-succes';

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      Login(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
    })
    
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Programlingo</CardTitle>
              <CardDescription className="text-center">
                Login untuk melihat kursus
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {/* <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="m@example.com" required type="email" /> */}
                    <FormField 
                      control={form.control}
                      name= "email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input 
                                {...field}
                                disabled={isPending}
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                placeholder="enter your email"
                                type="email"
                                required
                              />
                              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    {/* <Label htmlFor="password">Password</Label>
                    <Input id="password" required type="password" /> */}
                    <FormField 
                        control={form.control}
                        name= "password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Input 
                                  {...field}
                                  disabled={isPending}
                                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                  placeholder="*****"
                                  type="password"
                                  required
                                />
                                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                              </div>
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                  </div>
                </div>
                <div className='mt-2'>
                  <FormError message={error}/>
                </div>

                <div className='mt-2'>
                  <FormSuccess message={success}/>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button disabled={isPending}
                type='submit' 
                className="w-full">
                  Log In
              </Button>
              <div className="text-sm text-center text-gray-500">
                {`Betuk belum punya akun?`}{" "}
                <Link className="text-primary hover:underline" href="/register">
                  Daftar
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}