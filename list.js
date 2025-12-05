exports.handler = async (event, context) => {
    const keys = await context.client.list();
    let records = [];

    for (let k of keys) {
        const val = await context.client.get(k);
        records.push(JSON.parse(val));
    }

    return { statusCode: 200, body: JSON.stringify(records) };
};
