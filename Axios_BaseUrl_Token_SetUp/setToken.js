import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToken = async (token) => {
    try {
        await AsyncStorage.removeItem('user_login_token');
        await AsyncStorage.setItem('user_login_token', token);
        // console.log('Token stored successfully');
    } catch (error) {
        console.error('Failed to store the token', error);
    }
};

// Fetch token from external API and persist it
export const fetchAndSetAuthToken = async () => {
    try {
        const url = 'https://yatrisubidha.wb.gov.in/service/GenerateAuthTokenV1';
        alert("Token API started: " + url);
        console.log('URL:', url);
        // Build multipart form like curl
        const boundary = '----rnformboundaryAuthTokenX';
        const body = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="UserName"',
            '',
            '"admin"',
            `--${boundary}`,
            'Content-Disposition: form-data; name="Password"',
            '',
            '"Vyoma@123"',
            `--${boundary}`,
            'Content-Disposition: form-data; name="AuthInfo"',
            '',
            '"{}"',
            `--${boundary}--`,
            ''
        ].join('\r\n');

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body,
        });

        const contentType = res.headers.get('content-type') || '';
        const raw = contentType.includes('application/json') ? await res.json() : JSON.parse(await res.text() || '{}');
        console.log('Raw:', raw);
        const token = raw?.data?.authorization?.token;
        console.log('Token:', token);
        if (token) {
            await setToken(token);
            return token;
        }
        throw new Error('Token not found in response');
    } catch (err) {
        console.error('Failed to fetch auth token', err);
        throw err;
    }
};