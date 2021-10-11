// This can be used to wrap functions that aren't easily exposed
// to add custom behavior
export class FunctionWrapper {
    private parent: any
    private field: string
    private replacer: Function
    private patched: boolean
    constructor(parent : any, fn_field: string, replacer: Function) {
        this.parent = parent
        this.field = fn_field
        this.replacer = replacer
        this.patched = false
    }

    patch(){
        if(this.patched) {
            return
        }
        this.patched = true
        this.parent[this.wrappedName()] = this.parent[this.field]
        this.parent[this.field] = this.replacer
        this.patched = true
    }

    unpatch(){
        if(!this.patched) {
            return
        }
        this.parent[this.field] = this.parent[this.wrappedName()]
        delete this.parent[this.wrappedName()]
        this.patched = false
    }

    isPatched(){
        return this.patched
    }

    updateReplacer(replacer : Function){
        this.replacer = replacer
    }

    private wrappedName() : string{
        return `ht_${this.field}`
    }
}