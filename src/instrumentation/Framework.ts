export class Framework {
    private static instance: Framework | undefined;
    public config: any

    private frameworks: Map<string, boolean>
    static supportedFrameworks = ['express', 'koa', 'nestjs', 'sails', 'hapi']

    private constructor() {
        this.frameworks = new Map<string, boolean>()
        for (let framework of Framework.supportedFrameworks) {
            this.frameworks[framework] = this.available(framework)
        }
    }

    public static getInstance(): Framework {
        if (!Framework.instance) {
            Framework.instance = new Framework();
        }

        return Framework.instance;
    }

    // if a framework is not just express(but a framework on top of express)
    // we can pass filter error up middleware chain cleanly from event based body read
    // if it is purely express, we need to end response immediately
    public isPureExpress = () => {
        return !(this.frameworks['sails'] || this.frameworks['nestjs'] || this.frameworks['koa'] || this.frameworks['hapi']);
    }

    public isExpressBased = () => {
        return (this.frameworks['sails'] || this.frameworks['nestjs'])
    }

    public noFrameworks = () => {
        return(this.frameworks['sails'] || this.frameworks['nestjs'] || this.frameworks['koa'] || this.frameworks['hapi'] || this.frameworks['express'])
    }

    available = (mod: string) => {
        try {
            require.resolve(mod)
            return true
        } catch {
            return false
        }
    }
}