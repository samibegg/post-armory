import NextAuth from "next-auth"
import { nextAuthOptions } from "@/lib/auth" // Import shared config with new name

export default NextAuth(nextAuthOptions);
