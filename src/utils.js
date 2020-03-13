export function authHeader(token) {
    return {
        headers: {
            "Authorization": "Bearer ${token}"
        }
    }
}

export async function request(url, success, error, failure, options = {}) {

    options["headers"] = {...options.headers, "Content-Type": "application/json", "Accept": "application/json"};
    options = {...options, body: JSON.stringify(data)}
    return await fetch(url, options)
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                // for anything in 200-299 we expect our API to return a JSON response
                res.then(json => {
                    return success(json)
                })
            } else {
                // For all other errors we are not sure if the response is JSON,
                // so we just want to display a generic error modal
                return error(res)
            }
        }).catch((ex) => {
            return failure(ex)
        })
}