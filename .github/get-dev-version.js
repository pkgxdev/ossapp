const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const [commitHash, pkgVersion] = process.argv.slice(2);

async function getBumpVersion(pkg_version, hash) {
    const pairsCollection = firestore.collection('pairs');
    let bump_version;

    await firestore.runTransaction(async (t) => {
        const query = pairsCollection.where('pkg_version', '==', pkg_version).where('hash', '==', hash);
        const querySnapshot = await t.get(query);
        
        if (!querySnapshot.empty) {
            // Pairing exists
            bump_version = querySnapshot.docs[0].data().bump_version;
        } else {
            // Pairing does not exist
            const latestDocSnapshot = await t.get(pairsCollection.where('pkg_version', '==', pkg_version).orderBy('created_at', 'desc').limit(1));
            if (!latestDocSnapshot.empty) {
              const latestDoc = latestDocSnapshot.docs[0];
              const latestBumpVersion = latestDoc.data().bump_version;
              const parts = latestBumpVersion.split('.');
              parts[3] = String(Number(parts[3]) + 1); // Bump the version
              bump_version = parts.join('.');
          } else {
              // Collection is empty, start with default bump_version
              bump_version = [pkg_version, '.0'].join('');
          }

          // Save the new pairing
          await t.set(pairsCollection.doc(), {
              pkg_version: pkg_version,
              hash: hash,
              created_at: Firestore.Timestamp.now(),
              bump_version: bump_version
          });
        }
    });

    return bump_version;
}

// Use the function
getBumpVersion(pkgVersion, commitHash).then(bump_version => {
    console.log(`::set-output name=version::${bump_version}`);
}).catch(err => {
    console.error(err);
});