import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res){

    const data = req.body;
    const date = JSON.parse(data).date;
    console.log('API MOONPHASE DATA')
    console.log(data)
    console.log(JSON.parse(data).date.split('-'))
    console.log(date)
    const tmp = JSON.parse(data).date.split('-');
    const newDate = `${tmp[1]}/${tmp[2]}/${tmp[0]}`;
    const myMonth = parseInt(tmp[1]);
    const myDay = parseInt(tmp[2]);
    const myYear = parseInt(tmp[0]);

    console.log('got here moonphase api')
    const jsonDirectory = path.join(process.cwd(), 'json');
    // const fileContents = await fs.readFile(jsonDirectory + '/1997-moon-phases.json', 'utf8');
    // const jsonDirectory = path.join(process.cwd(), 'json');
    const fileContents = await fs.readFile(jsonDirectory + '/out.json', 'utf8');

    let low = null;
    let high = null;

    const parsedContents = JSON.parse(fileContents)

    // console.log(parsedContents)

    for(let i = 0 ; i< parsedContents.length; i++){
            const year = parsedContents[i].date.split('/')[2];
            const day = parsedContents[i].date.split('/')[1];
            const month = parsedContents[i].date.split('/')[0];
            
            if(year == myYear && month == myMonth){
                if(low){
                    if(day < myDay && low.date.split('/')[1] < day){
                        low = parsedContents[i]
                        high = parsedContents[i+1]
                    }
                }else{
                    if(day < myDay){
                        low = parsedContents[i]
                        high = parsedContents[i+1]
                    }else {
                        low = parsedContents[i-1]
                        high = parsedContents[i]
                    }
                }
            }
    }

    res.status(200).json({low, high});
}