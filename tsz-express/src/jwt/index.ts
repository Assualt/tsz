import { injectable } from "inversify";
import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'
import { Strategy, ExtractJwt } from 'passport-jwt'

@injectable()
export class JwtTool {
    private secret = "abcd@49@*#$()";
    private jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.secret
    }

    constructor() {
        this.strategy()
    }

    public strategy() {
        let val = new Strategy(this.jwtOptions, (payload, done) => {
            done(null, payload)
        })

        passport.use(val)
    }

    static middleware() {
        return passport.authenticate('jwt', { session: false })
    }

    /**
     * 生成token
     */
    public createToken(payload: Object) {
        return jsonwebtoken.sign(payload, this.secret, { expiresIn: '7d' })
    }

    /***
     * 关联到express
     */
    public init() {
        return passport.initialize()
    }
}