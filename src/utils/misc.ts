export type Nullable<T> = { [K in keyof T]: T[K] | null };

// Compares the properties of one object against the
// properties of another object.
export function isShallowEquals(o1: any, o2: any){
    for(var p in o1){
        if(o1.hasOwnProperty(p)){
            if(o1[p] !== o2[p]){
                return false;
            }
        }
    }
    for(var p in o2){
        if(o2.hasOwnProperty(p)){
            if(o1[p] !== o2[p]){
                return false;
            }
        }
    }
    return true;
};