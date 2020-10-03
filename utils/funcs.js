var env = process.env.NODE_ENV || "development";

var GeneralFunctions = {};

GeneralFunctions.createActivationToken = function(){
    const secret = "Ade203040$!!";
    var date = new Date();
    var dateNow = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

    const hash = crypto.createHmac('sha256', secret).update(dateNow).digest('hex');
    return hash
}

GeneralFunctions.createFiveDigitsCode = function(){
    var code = Math.floor(10000 + Math.random() * 90000);
    return code;
}

module.exports = GeneralFunctions;