'use client'
import Link from "next/link"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { signIn } from "next-auth/react";
// import { signIn } from "next-auth/react";

  const formSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: "This field has to be filled.",
      })
      .email("This is not a valid email")
      .max(300, {
        message: "Password can't be longer than 300 characters.",
      }),
    password: z
      .string()
      .min(6, { message: "Password has to be at least 6 characters long." }),
  });

export default function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
      });
    
    //   const router = useRouter();
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await signIn("credentials", {
          email: values.email,
          password: values.password,
        });
        console.log("response", response)
        if (!response?.error) {
            // router.push("/dashboard");
        }
    
        // toast.success("You are now signed in!");
      }
    
    
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="johndoe@whatever.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center">
                        <div>Password</div>
                        <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm text-black"
                >
                  Forgot your password?
                </Link>
                    </FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">
              Login
            </Button>
            </form>
            </Form>
        
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
