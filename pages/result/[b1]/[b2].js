import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import path from 'path';
import { promises as fs } from 'fs';

export async function getServerSideProps({params}){
    console.log('got here')

    const jsonDirectory = path.join(process.cwd(), 'json');
    const fileContents = await fs.readFile(jsonDirectory + '/out.json', 'utf8');

    console.log(params)
    
    // console.log(fileContents)

    return{
        props:{fileContents}
    }
}

export default function Result({fileContents}){

    const moonData = JSON.parse(fileContents)
    console.log(moonData)

    const router = useRouter()
    const {b1, b2} = router.query

    const bb1 = b1.split('-').join('/');
    const bb2 = b2.split('-').join('/');


    const getMoonData = (date) => {

        const myYear = date.split('/')[0]
        const myMonth = date.split('/')[1]
        const myDay = date.split('/')[2]

        let output = null;
        let outputplusone = null;
        for(let i = 0; i<moonData.length; i++){
            const year = moonData[i].date.split('/')[2];
            const day = moonData[i].date.split('/')[1];
            const month = moonData[i].date.split('/')[0];
            if(year == myYear && month == myMonth){
                if(output){
                    if(day < myDay && output.date.split('/')[1] < day){
                        output = moonData[i]
                        outputplusone = moonData[i+1]
                    }
                }else{
                    if(day < myDay){
                        output = moonData[i]
                        outputplusone = moonData[i+1]
                    }else {
                        output = moonData[-i]
                        outputplusone = moonData[i]
                    }
                }
            }

        }
        return({low: output, high: outputplusone});
    }

    const foundDataBB1 = getMoonData(bb1);
    const foundDataBB2 = getMoonData(bb2);
    console.log(foundDataBB1)
    console.log(foundDataBB2)


    return(
        <>
            <p>Result</p>
            <p>b1:</p>
            <p>{b1}</p>
            <p>{bb1}</p>
            {/* <p>{foundDataBB1}</p> */}
            <p>b2:</p>
            <p>{b2}</p>

            {/* <p>{moonData? (console.log(moonData)) : "Loading"}</p> */}
        </>
    )
}