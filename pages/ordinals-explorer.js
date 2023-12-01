import React from 'react'
import { Container } from 'react-bootstrap';
import OrdinalGrid from '../components/OrdinalExplorer/OrdinalGrid';
import TagCloud from '../components/OrdinalExplorer/TagCloud';
import BlockCloud from '../components/OrdinalExplorer/BlockCloud';
import Head from 'next/head';
import { useState } from 'react';

const explorerURL = process.env.REACT_APP_MAINNET_URL;

export async function getBlocksList() {
    try {
        const blockHeight = await fetch('https://mempool.space/api/blocks/tip/height');
        const blockHeightJSON = await blockHeight.json();
        const blockList = await fetch(`https://mempool.space/api/v1/blocks/${blockHeightJSON}`);
        const blockListJSON = await blockList.json();
        const heightArray = await blockListJSON.map(block => block.height);
        return heightArray;
    } catch (error) {
        console.error(error);
    }
}



export async function getOrdinalsList() {


    try {
        const response = await fetch(`${explorerURL}/inscriptions`, {
            headers: {
                'Accept': 'application/json'
            }

        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (response.headers.get('content-type').includes('application/json')) {
            const data = await response.json();
            // console.log('Data in getOrdinalsList:', data.inscriptions); // Check the data
            return data.inscriptions

        }
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            props: {},
        };
    }
}

export async function fetchOrdinalData(ordinalId) {
    // console.log('Fetching data for ordinal ID:', ordinalId); // Check the ordinal ID
    try {
        const response = await fetch(`${explorerURL}/inscription/${ordinalId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        // console.log('Response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (response.headers.get('content-type').includes('application/json')) {
            const responseJSON = await response.json();
            return {
                ordinalData: responseJSON,
                timestamp: responseJSON.timestamp,
                inscription_id: responseJSON.inscription_id,
                inscription_number: responseJSON.inscription_number,
                content_type: responseJSON.content_type
            };
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchAllOrdinalsData(ordinals) {
    // console.log('Ordinals in fetchAllOrdinalsData:', ordinals); // Check the ordinals array
    const data = await Promise.all(ordinals.map(fetchOrdinalData));
    // console.log('Data in fetchAllOrdinalsData:', data); // Check the fetched data
    return data;
}

export async function getServerSideProps(context) {
    const blocksList = await getBlocksList();
    const inscriptionsList = await getOrdinalsList(blocksList[0]);
    // console.log('Inscriptions list in getServerSideProps:', inscriptionsList); // Check the inscriptions list
    const ordinalsData = await fetchAllOrdinalsData(inscriptionsList);
    // console.log('Ordinals data in getServerSideProps:', ordinalsData); // Check the ordinals data
    return { props: { ordinalsData, blocksList } };
}


// Explorer component
const explorer = ({ ordinalsData, blocksList }) => {

    // const [ordinals, setOrdinals] = useState(inscriptionsList);
    const [selectedBlock, setSelectedBlock] = useState(blocksList[0]);

    return (
        <div>
            <Head>
                <title>Ordimint - Ordinals Explorer</title>
                <meta name="description" content="Explore Ordimint's comprehensive and searchable database of Bitcoin Ordinal Collections, showcasing Ordinals and their inscriptions in one convenient location." />
                <meta name="keywords" content="Bitcoin, Ordinals, Collections,Inscriptions, Searchable, Digital Assets, Inscriptions, NFT" />
                <meta property="og:title" content="Ordimint - A website to mint, receive, store or send your Ordinals" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://ordimint.com/Ordimint-Twitter-card.jpeg" />
                <meta property="og:description" content="A website to mint, receive, store or send your Ordinals. View all new Ordinal Collections, Inscribe or use our wallet." />

                <meta name="twitter:card" content="https://ordimint.com/Ordimint-Twitter-card.jpeg" />
                <meta name="twitter:title" content="Ordimint - A website to mint, receive, store or send your Ordinals" />
                <meta name="twitter:description" content="A website to mint, receive, store or send your Ordinals" />
                <meta name="twitter:image" content="https://ordimint.com/Ordimint-Twitter-card.jpeg" />
            </Head>
            <div className="main-middle">
                <h1 className='m-4'>Latest Inscriptions</h1>

                <Container fluid>
                    <BlockCloud blocksList={blocksList} selectedBlock={blocksList[0]} block={blocksList[0]} />

                    {/* <TagCloud selectedTags={selectedTags} setSelectedTags={setSelectedTags} /> */}

                    <OrdinalGrid ordinalsData={ordinalsData} />
                </Container>



            </div>
        </div >)

}


export default explorer
