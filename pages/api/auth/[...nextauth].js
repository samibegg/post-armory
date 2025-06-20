// --- /pages/api/auth/[...nextauth].js (UPDATED) ---
// This version restores the official MongoDB adapter, which is required for the Email Provider.
// The npm dependency error must be resolved by aligning package versions.
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromiseAuth from "../../../lib/mongodb"
import nodemailer from "nodemailer"

// HTML email template
const html = ({ url, host, email }) => `
<body style="background: #f9f9f9; padding: 20px; font-family: sans-serif;">
  <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">
    <h1 style="color: #333;">Sign in to ${host}</h1>
    <p style="color: #555;">Click the button below to sign in to your account.</p>
    <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #0891b2; color: #fff; text-decoration: none; border-radius: 5px;">Sign In</a>
    <p style="color: #888; font-size: 12px;">If you did not request this email, you can safely ignore it.</p>
  </div>
</body>
`

// Text email template
const text = ({ url, host }) => `Sign in to ${host}\n${url}\n\n`

export default NextAuth({
  // The adapter is required for the Email Provider to store verification tokens.
  adapter: MongoDBAdapter(clientPromiseAuth),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      // When using an adapter, NextAuth can automatically handle sending the email if nodemailer is installed.
      // The custom sendVerificationRequest function is not needed.
      async sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
        const { host } = new URL(url)
        const transport = nodemailer.createTransport(server)
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        })
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    // The signIn callback is no longer needed as the adapter handles user creation.
    async session({ session, token }) {
      session.user.id = token.sub; // The 'sub' property from the JWT token is the user's ID.
      return session;
    },
  },
  pages: {
    signIn: '/', 
    verifyRequest: '/auth/verify-request',
  }
})
