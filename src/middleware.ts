import { 
    publicRoutes,
    authRoutes
} from "./routes";
import { match } from 'path-to-regexp';
import { NextResponse, NextRequest } from 'next/server'; 
import jwt from 'jsonwebtoken';

const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge'
export const runtime = isEdgeRuntime ? 'edge' : 'nodejs'

const baseURL = process.env.SERVER_MODE === 'production' ? process.env.SERVER_PRODUCTION_URL : process.env.SERVER_DEVELOPMENT_URL;

const getNewAccessToken = async (refreshToken: string) => {
    try {
        if(!refreshToken) throw new Error("Invalid access token");
        const response = await fetch(`${baseURL}/auth/refresh-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refresh_token=${refreshToken}`,
            },
            credentials: 'include',
        });
        const data = await response.json();
        const newAccessToken = data?.data?.access_token;
        if(!newAccessToken) throw new Error("Access token not found");
        return newAccessToken;
    } catch (error) {
        throw error;
    }
};

const checkValidAccessToken = async (accessToken: string) => {
    try {
        if (!accessToken) throw new Error("Access token is missing");

        const response = await fetch(`${baseURL}/auth/check-auth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken || ''}`,
            },
            credentials: 'include',
        });
        const data = await response.json();
        if(data.statusCode === 401){
            throw new Error("Access token is invalid");
        }
        return data?.data?.isAuthenticated;
    } catch(error){
        throw error;
    }
}


export async function middleware(req: NextRequest) {
    const { nextUrl } = req;
    try {
        const pathname = nextUrl.pathname;
        const isPublicRoute = publicRoutes.some(route => {
            const matcher = match(route, { decode: decodeURIComponent });
            return matcher(pathname); 
        });
        
        const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    
        if (isPublicRoute || isAuthRoute) {
            return NextResponse.next();
        }
        const response = NextResponse.next();
        const accessToken = req.cookies.get('access_token')?.value
        const refreshToken = req.cookies.get('refresh_token')?.value
        if(!accessToken) {
            if(!refreshToken) return NextResponse.redirect(new URL("/auth/login", nextUrl));
            try {
                const res = await getNewAccessToken(refreshToken as string);
                const newAccessToken = res.access_token;
                const decodedToken = jwt.decode(newAccessToken) as jwt.JwtPayload;
                const expirationTime = decodedToken?.exp ? new Date(decodedToken?.exp * 1000) : Math.floor(Date.now() / 1000) + 3600;
                response.cookies.set('access_token', newAccessToken, {
                    path: '/',
                    expires: expirationTime,
                });
                return response;
            } catch (error) {
                return NextResponse.redirect(new URL("/auth/login", nextUrl));
            }
        }

        try {
            const isAuthValid = await checkValidAccessToken(accessToken);
            if (!isAuthValid) throw new Error("Access token is invalid");
            return response;
        } catch (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/auth/login", nextUrl));
        }
    } catch (error) {
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }

}
export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

