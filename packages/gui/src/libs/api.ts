import { getClient } from '@tauri-apps/api/http';
import { Buffer } from 'buffer';


const username = 'user';
const password = 'password';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const base = 'https://api.tea.xyz/v1';

export async function get<T>(path: string){
    const client = await getClient();
    const uri = join(base, path);
    const { data } = await client.get<T>(uri.toString(), {
        headers: {
            Authorization: auth
        }
    });
    return data;
}

const join = function(...paths: string[]){
    return paths.map(function(path){
        if(path[0] === "/"){
            path = path.slice(1);        
        }
        if(path[path.length - 1] === "/"){
            path = path.slice(0, path.length - 1);   
        }
        return path;     
    }).join("/");
}