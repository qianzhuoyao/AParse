```javascript
//帮助解析包含简单kv对与逻辑符（and / or）的字符串STRING
new Parse(STRING).parse().getResult()
```
```javascript
demo:
    STRING = "id:123 and age>= 123"
RESULT = [{..., value: id}, {..., value: ' '}, {..., value: 123}, {..., value: and}, {..., value: " "}...]
```
