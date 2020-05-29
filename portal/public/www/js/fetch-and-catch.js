const _fetch = ( uri, method, payload, token ) =>{
	return new Promise(( resolve, reject )=>{
		fetch(uri, {
			method: method || 'GET',
			body: JSON.stringify(payload) || null,
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			referrer: 'no-referrer'
		}).then(function (response) {
			// The API call was successful!
			if (response.ok) {
				return response.json();
			} else {
				return Promise.reject(response);
			}
		}).then(function (data) {
			// This is the JSON from our response
			resolve(data)
		}).catch(function (err) {
			// There was an error
			reject(err);
		});
  })
};

const _fetchGet = (uri, token ) =>{
	return new Promise(( resolve, reject )=>{
		fetch(uri, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			},
			referrer: 'no-referrer'
		}).then(function (response) {
			// The API call was successful!
			if (response.ok) {
				return response.json();
			} else {
				return Promise.reject(response);
			}
		}).then(function (data) {
			// This is the JSON from our response
			resolve( data )
		}).catch(function (err) {
			// There was an error
			reject(err);
		});
	})
	
};
