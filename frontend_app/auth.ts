import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { string, z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import {jwtDecode} from "jwt-decode";
import { json } from 'stream/consumers';

//#region types

export type TokenData = {
  id: string;
  name: string;
  email: string;
  exp: number;
};

export type AuthData = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  exp: number;
  access_expiration: number;
}

//#endregion
 
async function getUserAccess(email: string, password: string){
  //console.log("GET USER ACCESS START");
  try {
    console.log("API BASE URL: " + process.env.API_BASE_URL);
    const user_access_data = await fetch(process.env.API_BASE_URL + "/api/token/",{
      method: "POST",
      headers: {"Content-Type": "Application/json"},
      body: JSON.stringify({
        email: email,
        password: password,
        brand: "FPS" //For now the only brand available. TODO: Send brand from login form relative to the url used to access
      })
    });
    //const user_data = await fetch;
    if(user_access_data.ok){
      const access_data = await user_access_data.json();
      const user_data = jwtDecode<TokenData>(access_data.access);
      //console.log("USER ACCESS DATA IS OK");
      //console.log("ACCESS TOKEN:\n" + JSON.stringify(user_data));
      //console.log("BACKEND TOKEN:\n" + JSON.stringify(access_data));
      const res : AuthData = {
        id: user_data.id,
        name: user_data.name,
        email: user_data.email,
        accessToken: access_data.access,
        refreshToken: access_data.refresh,
        exp: 60 * 60,
        access_expiration: user_data.exp
      }
      //console.log("AUTH DATA:\n" + JSON.stringify(res));
      return res;
    }
    
  } catch (error) {
    console.error('Failed to fetch user login data:', error);
    return null;
  }
}



export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          //console.log("AUTH CREDENTIALS------------------- " + email + " ----------------------");
          const res = await getUserAccess(email, password);
          if (res) return res;
        }

        //console.log('Invalid credentials'); 
        return null;
      },
    }),
  ],
});