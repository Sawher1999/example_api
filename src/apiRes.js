res = (code, msg, data) => {
    return {
        code: code,
        requestDate: new Date(),
        message: msg,
        data: data
    }
}

module.exports = {
	res
};