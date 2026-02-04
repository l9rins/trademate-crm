import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Replacing with Lucide? I should iterate.
import { User, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner"
import { GlobalSearch } from "./GlobalSearch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Layout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/' },
        { name: 'Clients', href: '/clients' },
        { name: 'Jobs', href: '/jobs' },
    ];

    return (
        <>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-white shadow-sm border-b">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 justify-between">
                                    {/* Logo and Nav Links */}
                                    <div className="flex">
                                        <div className="flex flex-shrink-0 items-center">
                                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TradeMate</span>
                                        </div>
                                        <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        location.pathname === item.href
                                                            ? 'border-indigo-500 text-gray-900'
                                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                        'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Search and Profile */}
                                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                                        <GlobalSearch />

                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="focus:outline-none">
                                                <Avatar>
                                                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                                        {user?.username?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    <span>Logout</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Mobile Button */}
                                    <div className="-mr-2 flex items-center sm:hidden">
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <X className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu */}
                            <Disclosure.Panel className="sm:hidden">
                                <div className="space-y-1 pb-3 pt-2">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as={Link}
                                            to={item.href}
                                            className={classNames(
                                                location.pathname === item.href
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                                                'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                            )}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 pb-3 pt-4">
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <Avatar>
                                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                                    {user?.username?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800">{user?.username}</div>
                                            <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        <Disclosure.Button
                                            as="button"
                                            onClick={logout}
                                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                                        >
                                            Sign out
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
                <Toaster />
            </div>
        </>
    );
}
