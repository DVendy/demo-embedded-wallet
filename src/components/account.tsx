"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useTurnkey } from "@turnkey/sdk-react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
} from "lucide-react"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"

import { truncateAddress } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { useWallets } from "@/hooks/use-wallets"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Skeleton } from "./ui/skeleton"

export default function Account() {
  const { logout } = useAuth()
  const { user } = useUser()
  const {
    newWallet,
    wallets,
    selectedWallet,
    setSelectedWallet,
    selectedAccount,
    setSelectedAccount,
    newWalletAccount,
  } = useWallets()
  const [isOpen, setIsOpen] = useState(false)
  const [isNewWalletMode, setIsNewWalletMode] = useState(false)
  const [newWalletName, setNewWalletName] = useState("")

  const handleNewWallet = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    setIsNewWalletMode(true)
  }

  const handleNewAccount = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    newWalletAccount()
  }

  const handleCreateWallet = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Creating new wallet:", newWalletName)
      newWallet(newWalletName)
      setIsNewWalletMode(false)
      setNewWalletName("")
    },
    [newWalletName, newWallet]
  )

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    console.log(user, selectedWallet, selectedAccount)
  }, [user, selectedWallet, selectedAccount])

  useEffect(() => {
    setTimeout(() => {
      setIsNewWalletMode(false)
    }, 100)
  }, [isOpen])

  // Check if the user is undefined and redirect to "/"
  // useEffect(() => {
  //   const checkUser = async () => {
  //     const user = await turnkey?.getCurrentUser()
  //     console.log("user", user)
  //     if (!user) {
  //       router.push("/")
  //     }
  //   }
  //   if (turnkey) {
  //     checkUser()
  //   }
  // }, [turnkey])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="dark" asChild>
        <Button
          variant="outline"
          className="h-full w-min justify-between gap-3 bg-none text-foreground"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-1/2 w-auto bg-muted  p-1.5">
              <AvatarFallback className="bg-transparent text-base font-semibold"></AvatarFallback>
            </Avatar>
            {selectedWallet?.walletName && selectedAccount?.address ? (
              <div className="text-left">
                <div className="text-sm font-semibold ">
                  {selectedWallet?.walletName}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {selectedAccount?.address
                    ? truncateAddress(selectedAccount?.address)
                    : ""}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-12  rounded-[3px]" />
                <Skeleton className="h-3 w-[120px] rounded-[3px]" />
              </div>
            )}
          </div>
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-min bg-background text-foreground">
        <DropdownMenuLabel className="dark flex w-full items-center gap-2">
          <Avatar className="h-12 w-12 bg-muted  p-1">
            {/* <AvatarFallback className="bg-transparent text-base font-semibold text-primary">
              AD
            </AvatarFallback> */}
          </Avatar>
          <div className="flex flex-col">
            <span className=" font-semibold">{user?.username}</span>
            <span className="text-xs text-muted-foreground">
              {user?.email || ""}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="">
          <span>Wallets</span>
        </DropdownMenuLabel>
        {wallets.map((wallet) => (
          <DropdownMenuCheckboxItem
            key={wallet.walletId}
            checked={selectedWallet?.walletId === wallet.walletId}
            onCheckedChange={() => setSelectedWallet(wallet)}
            className="flex items-center py-2"
          >
            {wallet.walletName}
          </DropdownMenuCheckboxItem>
        ))}

        {isNewWalletMode ? (
          <div className="space-y-2 px-2 py-1.5">
            <input
              type="text"
              placeholder="Wallet name"
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()} // Prevent dropdown menu from handling key events
              className="w-full bg-transparent px-0 py-1 text-sm text-foreground placeholder-muted-foreground focus:outline-none"
            />
            <Button
              onClick={handleCreateWallet}
              variant="outline"
              className="w-full text-sm"
            >
              Create
            </Button>
          </div>
        ) : (
          <DropdownMenuItem onSelect={handleNewWallet}>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            <span>New Wallet</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2">
          <span>Accounts</span>
          {/* <span className="text-xs text-muted-foreground">View all</span> */}
        </DropdownMenuLabel>

        {selectedWallet?.accounts.map((account) => (
          <DropdownMenuCheckboxItem
            key={account.address}
            checked={selectedAccount?.address === account.address}
            onCheckedChange={() => setSelectedAccount(account)}
            className="flex items-center py-2"
          >
            {account.address ? truncateAddress(account.address) : ""}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuItem onSelect={handleNewAccount}>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          <span>New Account</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SettingsIcon className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}