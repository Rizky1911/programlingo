'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, CreditCard, Lock, User } from 'lucide-react'

const profileSchema = z.object({
  yourName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  storeName: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  location: z.string(),
  currency: z.string(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string(),
  address: z.string(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function EditProfilePage() {
  const [avatar, setAvatar] = useState("/placeholder.svg")

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      yourName: "Mathew Anderson",
      storeName: "Macima Studio",
      location: "United States",
      currency: "India (INR)",
      email: "info@materialm.com",
      phone: "+91123456789",
      address: "814 Howard Street, 120065, India",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values)
  }

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    console.log(values)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="w-full bg-gray-50 border-b border-gray-200">
              <TabsTrigger value="account" className="flex items-center gap-2 px-4 py-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notification" className="flex items-center gap-2 px-4 py-2">
                <Bell className="h-4 w-4" />
                Notification
              </TabsTrigger>
              <TabsTrigger value="bills" className="flex items-center gap-2 px-4 py-2">
                <CreditCard className="h-4 w-4" />
                Bills
              </TabsTrigger>
              <TabsTrigger value="change-password" className="flex items-center gap-2 px-4 py-2">
                <Lock className="h-4 w-4" />
                Change Password
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="p-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Profile</CardTitle>
                      <p className="text-sm text-gray-500">
                        Change your profile picture from here
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src={avatar} />
                        <AvatarFallback>MA</AvatarFallback>
                      </Avatar>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Upload
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-red-100 hover:bg-red-200 text-red-500"
                          onClick={() => setAvatar("/placeholder.svg")}
                        >
                          Reset
                        </Button>
                      </div>
                      <Input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && file.size <= 800 * 1024) {
                            const reader = new FileReader()
                            reader.onload = (e) => setAvatar(e.target?.result as string)
                            reader.readAsDataURL(file)
                          } else {
                            alert("File size should be less than 800KB")
                          }
                        }}
                      />
                      <p className="text-sm text-gray-500 mt-4">
                        Allowed JPG, GIF or PNG. Max size of 800K
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Details</CardTitle>
                      <p className="text-sm text-gray-500">
                        To change your personal detail, edit and save from here
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="yourName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="storeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="United States">United States</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                  <SelectItem value="Australia">Australia</SelectItem>
                                  <SelectItem value="India">India</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD ($)</SelectItem>
                                  <SelectItem value="EUR">EUR (€)</SelectItem>
                                  <SelectItem value="GBP">GBP (£)</SelectItem>
                                  <SelectItem value="India (INR)">INR (₹)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-4 mt-6">
                        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                          Save
                        </Button>
                        <Button type="button" variant="outline" className="text-red-500">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="change-password" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <p className="text-sm text-gray-500">
                    To change your password please confirm here
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-4 mt-6">
                        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                          Change Password
                        </Button>
                        <Button type="button" variant="outline" className="text-red-500">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}