/**
 * id:1 and index>=1000 or name:"张三"
 * block:[
 * {
 *     type:'key' //'key' 'operation' 'value' 'relation'
 *     point:0 //point anchor mouse
 *     value:'xxxx'
 * }
 * ]
 */

const SPLIT_CODE_LIST = ['>', '<', ' ', ':', '=', undefined]
const CODE = ['>=', '<=', '>', '<', '=', ':']
const COLLAPSE_CODE = ['>', '<']
const FREEZE_CODE = ['"', "'"]
const TWO_TIER_SYMBOL = 2    // >= <= 的长度
class Parse {
    constructor(string) {
        if (typeof string === "string") {
            this.str = string
            this.result = []
        } else {
            throw new Error('类型错误')
        }
    }

    segmentation() {
        const max = this.str.length
        let index = 0, finish = 0, freeze = false, freezeCode = undefined;
        while (finish <= max) {
            if (freeze) {
                if (this.str[finish] === freezeCode) {
                    freeze = false
                }
                finish++
            } else {
                if (FREEZE_CODE.includes(this.str[finish])) {
                    freeze = true
                    freezeCode = this.str[finish]
                    finish++
                } else {
                    if (SPLIT_CODE_LIST.includes(this.str[finish])) {
                        if (index === finish) {
                            finish++
                        }
                        if (COLLAPSE_CODE.includes(this.str[finish])) {
                            if (this.str[finish + TWO_TIER_SYMBOL - 1] === '=') {
                                this.checkPush(index, max, finish)
                                index = finish++
                                finish = finish + TWO_TIER_SYMBOL - 1
                            }
                        }
                        this.checkPush(index, max, finish)
                        index = finish
                    } else {
                        finish++
                    }
                }
            }
        }
        if (freeze) {
            throw new Error(`字符串处置异常,引号不完备`)
        }
    }


    checkPush(index, max, finish) {
        if (index < max) {
            const content = this.str.slice(index, finish)
            if (!this.checkSymbolCode(CODE.includes(content))) {
                throw new Error(`关系符重置,存在多个冲突的符号,冲突符号为:${content},其前符号位为${this.result.slice(-1)[0].value},错误起始位置=>${index},终止位置=>${finish}`)
            } else {
                this.pushResult(index, finish, content)
            }
        }
    }

    pushResult(start, end, content) {
        this.result.push({
            isEmpty: content === ' ',
            value: content,
            start: start,
            end: end,
            symbolCode: CODE.includes(content),
        })
    }

    checkSymbolCode(targetCode) {
        let res = true
        const latest = this.result.slice(-1)[0]
        if (latest) {
            if (latest.symbolCode && targetCode) {
                res = false
            }
        }
        return res
    }

    parse() {
        this.segmentation()
        return this
    }

    getResult() {
        return this.result
    }
}

/**
 * id:123 or @index>1000
 */
console.log(new Parse(`id:1 and index>=1000 or name:"张三"`).parse().getResult())
