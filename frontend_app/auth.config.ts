import { Console } from 'console';
import type { NextAuthConfig } from 'next-auth';
import { toKebab } from 'postgres';
import { json } from 'stream/consumers';
import {jwtDecode} from "jwt-decode";
import { access } from 'fs';

async function refreshAccessToken(refreshToken: string) {
  console.log("REFRESHING ACCESS TOKEN");
  try {
    const res = await fetch(process.env.API_BASE_URL + "/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    //console.log("ACCESS TOKEN PROPERLY REFRESHED: " + JSON.stringify(data.access));
    return data.access;
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      //console.log("IS LOGGED IN: " + isLoggedIn);
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        //console.log("IS ON DASHBOARD");
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
        //return Response.redirect(new URL('/login', process.env.API_BASE_URL));
      } else if (isLoggedIn) {
        //console.log("NOT IN DASHBOARD");
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async session({ session, token }) {
      const typedToken = token as{
        id: string;
        name: string;
        email: string;
        accessToken: string;
        refreshToken: string;
        exp: number;
        access_expiration: number;
      }
      //console.log("SESSION TOKEN: " + JSON.stringify(token));
      // Refresh token if needed


      

      const new_session = {
        ...session,
        user: {
          ...session.user,
          id: typedToken.id,
          name: typedToken.name,
          email: typedToken.email,
        },
        accessToken: typedToken.accessToken,
        refreshToken: typedToken.refreshToken,
      };


      return new_session;
    },
    async jwt({ token, user }) {

      type TokenData = {
        id: string;
        name: string;
        email: string;
        exp: number;
        access_expiration: number;
      };

      

      const typedToken = token as{
        id: string;
        name: string;
        email: string;
        accessToken: string;
        refreshToken: string;
        exp: number;
        access_expiration: number;
      }

      if (user) {
        //The code enter this section only once during the user first login

        const accessToken = jwtDecode<TokenData>(user.accessToken);
        const expiration = accessToken.exp;
        //console.log("EXPIRATION INSIDE ACCESS TOKEN JWT: " + expiration);

        const ret = {
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          access_expiration: expiration 
        };
        //console.log("ALARM RETURNING TOKEN WITH CUSTOM EXP: " + JSON.stringify(ret));
        return ret;
      }
      //console.log("JWT_TOKEN: " + JSON.stringify(token));

      //console.log("SESSION TOKEN: " + JSON.stringify(token));
      // Refresh token if needed
      let newAccessToken = typedToken.accessToken;
      //console.log("SESSION ACCESS TOKEN: " + JSON.stringify(jwtDecode<TokenData>(typedToken.accessToken)));
      const isTokenExpired = typedToken.access_expiration && Date.now() > typedToken.access_expiration * 1000; // Date.now is in milliseconds
      const token_exp = typedToken.access_expiration? typedToken.access_expiration * 1000 : 0;
      //console.log("token expiration -> " + token_exp + " DATE NOW -> " + Date.now() + " DIFFERENCE: -> " + (token_exp - Date.now()));
      
      let new_access_token = null;

      if (isTokenExpired) {
        //console.log("TOKEN IS EXPIRED");
        newAccessToken = await refreshAccessToken(typedToken.refreshToken);
        new_access_token = jwtDecode<TokenData>(newAccessToken);
        //console.log("\n-----------NEW ACCESS TOKEN---------\n" + JSON.stringify(new_access_token));
      }

      return{
        ...token,
        id: token.id,
        name: token.name,
        email: token.email,
        accessToken: newAccessToken,
        refreshToken: token.refreshToken,
        access_expiration: new_access_token? new_access_token.exp: token.access_expiration,
      };
    },
  },
  session: { strategy: "jwt", maxAge: 60 * 60}, //1 hour
  providers: [], // Add providers with an empty array for now
  trustHost: true,
} satisfies NextAuthConfig;