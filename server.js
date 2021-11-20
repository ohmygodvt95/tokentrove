const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://tokentrove.com/collection/GodsUnchainedCards');

  page.on('response', async (response) => {
    // allow XHR only
    if ('xhr' !== response.request().resourceType() || !response.url().startsWith('https://api.tokentrove.com/cached/all-orders')) {
      return;
    }
    let data = (await response.json()).map((card) => {
      card.metadata = JSON.parse(card.metadata);
      card.name = card.metadata?.name;
      return card;
    }).filter(card => card.metadata !== null).sort((a, b) => a.metadata.name > b.metadata.name);
    let key = {
      metadata: {
        name: '',
      }
    };
    const groupedData = [];
    let tmpArray = [];
    for (const card of data) {
      if (card.metadata.name !== key.metadata.name) {
        groupedData.push({
          name: key.metadata.name,
          cards: JSON.parse(JSON.stringify(tmpArray))
        })
        key = card;
        tmpArray = [];
      }
      tmpArray.push(card)
    }

    priceCompare(groupedData);
  });

  await page.waitForTimeout(10000);
  await browser.close();
})();
/**
 * groupedData structure
 */
// [
//   {
//     name: 'Catacomb Curator',
//     cards: [
//       {
//         token_proto: '1-1',
//         token_id: '0xb92f5947bb206664e3cacae845244a58d07190652ea95f900261e9a561051a08',
//         order_hash: 'imx-3130332',
//         makerAddress: '0xaadfef7ac2dec88c3e3c1826875ab6e46ba95ccd',
//         assetAmountRemaining: 3,
//         created_at: '2021-11-08T20:31:34.000Z',
//         pCount: 19,
//         metadata: {
//           name: 'xxx',
//           qualtity: 6
//         },
//         unique_data: null,
//         count: 3,
//         takerAssetAmount: 1500000000000000000,
//         name: 'Nethergram'
//       }
//     ]
//   }
// ]
function priceCompare(groupedData) {
  console.log(groupedData);
}
