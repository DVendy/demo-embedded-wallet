import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTurnkey } from "@turnkey/sdk-react"

import { Email, User } from "@/types/turnkey"

export const useUser = () => {
  const { turnkey } = useTurnkey()
  const router = useRouter()
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    const fetchUser = async () => {
      console.log("fetching user", turnkey)
      if (turnkey) {
        console.log("fetching user")

        const currentUser = await turnkey.getCurrentUser()

        if (currentUser) {
          let userData: User = currentUser
          const userSession = await turnkey.currentUserSession()

          // Retrieve the user's email
          const { user } =
            (await userSession?.getUser({
              organizationId: currentUser?.organization?.organizationId,
              userId: currentUser?.userId,
            })) || {}
          // Set the user's email in the userData object
          userData = { ...currentUser, email: user?.userEmail as Email }
          setUser(userData)
        } else {
          router.push("/")
        }

        // console.log({ currentUser })
        // const userSession = await turnkey.currentUserSession()

        // let userData: User = currentUser
        // if (currentUser?.userId && currentUser?.organization?.organizationId) {
        //   const { user } =
        //     (await userSession?.getUser({
        //       organizationId: currentUser?.organization?.organizationId,
        //       userId: currentUser?.userId,
        //     })) || {}
        //   userData = { ...currentUser, email: user?.userEmail as Email }
        //   console.log({ userData })
        // }

        // if (userData) {
        //   setUser(userData)
        // } else {
        //   router.push("/")
        // }
      }
    }
    fetchUser()
  }, [turnkey])

  const logout = async () => {
    if (turnkey) {
      await turnkey.logoutUser()
      setUser(undefined)
      router.push("/")
    }
  }

  return { user, logout }
}