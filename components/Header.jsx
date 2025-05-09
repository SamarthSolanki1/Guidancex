import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { checkUser } from '@/lib/checkUser'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = async () => {
    await checkUser();
  return (
    <header className='top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>
    <nav className='flex items-center justify-between px-6 h-16 w-full'>
        <Link href='/'>
            <Image 
                src="https://i.pinimg.com/736x/6e/7b/eb/6e7beb157f6eb675dae60738b2529969.jpg" 
                alt="gudance x logo" 
                width={200} 
                height={150} 
                className="h-20 w-20 object-cover rounded-full"
            />
        </Link>
        <div className="flex items-center gap-4">
            <SignedIn>
                <Link href={'/dashboard'}>
                    <Button variant={'outline'} className="flex items-center gap-2">
                        <LayoutDashboard className='h-4 w-4' />
                        <span className='hidden md:block'>Industry Insights</span>
                    </Button>
                </Link>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2">
                        <StarsIcon className='h-4 w-4' />
                        <span className='hidden md:block'>Growth Tools</span>
                        <ChevronDown className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link href={'/resume'} className='flex items-center gap-2'>
                            <FileText className='h-4 w-4' />
                            <span>Build Resume</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/ai-cover-letter'} className='flex items-center gap-2'>
                            <PenBox className='h-4 w-4' />
                            <span>Build Cover Letter</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/interview'} className='flex items-center gap-2'>
                            <GraduationCap className='h-4 w-4' />
                            <span>Interview Prep</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </SignedIn>
            <SignedOut>
                <SignInButton>
                    <Button variant={'outline'}>Sign In</Button>
                </SignInButton>
                <SignUpButton />
            </SignedOut>
            <SignedIn>
                <UserButton 
                appearance={{
                  elements :{
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-xl",
                    userPreviewMainIdentifier: "font-semibold",
                  }
                }}
                afterSignOutUrl='/'
                />
            </SignedIn>
        </div>
    </nav>
</header>
  )
}

export default Header