// Web developed BY MR lrbcode49

let slided = document.getElementById('slide')
let cardcity = document.querySelector(".cardcity")
let selectcity = document.getElementById('selectcity') //
let allmonthly = document.getElementById('allmonthly')

function slide(){
    axios.get("./CityMa.json")
    .then((response) => {
        let data = response.data
        let i = 0
        setInterval(()=>{
            slide.innerHTML = ""
            slided.innerHTML = `
            <div class="overlay">
            <h1>${data[i].name}</h1>  
            <p>
            ${data[i].description}
            </p>
            <button class="explorCitybtn" onclick="document.querySelector('.${data[i].name}').scrollIntoView({behavior:'smooth'})">Explore ${data[i].name}</button>
            </div>
            `
            slided.style.cssText = `
            background-image: url("${data[i].urlImage}")
            
            `
        
            i = (i + 1) % data.length
        },3000)

        //add data in card  city
        cardcity.innerHTML = ""
        for(getdata of data){
            cardcity.innerHTML += `
            <div class="cityget ${getdata.name}" >
                <img src="${getdata.urlImage}" alt="${getdata.name}">
                <h1>${getdata.name}   <span >${getdata.arabicName}</span></h1> 
                <p>
                ${getdata.detailedDescription}
                </p>
                <h3>Region: ${getdata.region}</h3>
                <h3> Population: ${getdata.population}</h3>
                <p>Popular Attractions:  <span style="color: red;" >${getdata.attractions.join(" | ")} </span></p>
                <button  onclick="GetPrayertimes('${getdata.name}'); document.querySelector('#allmonthly').scrollIntoView({behavior: 'smooth'});  getallmonthly('${getdata.name}')"    style="padding: 18px; border: none; border-radius: 10px; background-color: rgb(0, 128, 255); margin: 20px;" >Prayer Times</button>
                <button onclick="document.querySelector('#containerMap').scrollIntoView({behavior:'smooth'})" style="padding: 18px; border: none; border-radius: 10px;     background-color: var(--secondary-color);; margin: 20px;" >View on Map </button>
            </div>
                    
            `
            let option = document.createElement("option")
            option.textContent = getdata.name
            selectcity.appendChild(option)


        }
    }).catch((err) => {
        console.log(err.message)
        
    });
}
slide()


function GetPrayertimes(cityname){
    console.log(cityname)
    axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${cityname}&country=Morocco`)
    .then((response) =>{
        let city = response.data.data.timings
        let date =   response.data.data
        let prayertimesCOntainer = document.querySelector('.prayertimesCOntainer')
        prayertimesCOntainer.innerHTML = ""
        prayertimesCOntainer.innerHTML += `
        
                <h2 style="text-align: center; font-size: 30px;">${cityname} </h2>
                <p style="text-align: center; color: var(--secondary-color);">${date.date.readable}</p>
                
                <div id="contenttimee">
                 <section>
                    <h3><b>Fajr</b></h3>
                    <p>${city.Fajr}</p>
                </section>
                <section>
                    <h3><b>Dhuhr</b></h3>
                    <p>${city.Dhuhr}</p>
                </section>
                 <section>
                    <h3><b>Asr</b></h3>
                    <p>${city.Asr}</p>
                </section>
                <section>
                    <h3><b>Maghrib</b></h3>
                    <p> ${city.Maghrib}</p>
                </section>
                 <section>
                    <h3><b>Isha</b></h3>
                    <p>${city.Isha}</p>
                </section
                
                </div>
        `

    }).catch((err) => {
        console.log(err.message)
    })



}

//select option
selectcity.addEventListener("change", function(){
    if(this.value === "Select City")alert("select your city")
    GetPrayertimes(this.value)
    document.querySelector('.prayerTimes').scrollIntoView({
        behavior: "smooth",
    })
    // scroll({
    //     top: prayertimesCOntainer.offsetTop,
    //     behavior: "smooth"
    // })
    getallmonthly(this.value)


} )

function getallmonthly(city){

    let tbody= document.getElementById("tbody")
    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]
    const [year, month] = formattedDate.split('-')

    axios.get(`https://api.aladhan.com/v1/calendarByCity?city=${city}&country=Morocco&method=2&month=${month}&year=${year}`)
    .then((response) =>{
        let data = response.data.data
        allmonthly.style.display = "block"
        for(allmonth of data){
            tbody.innerHTML += `
                    <tr>
                        <td>${allmonth.date.gregorian.day} ${allmonth.date.gregorian.month.en}</td>
                        <td>${allmonth.timings.Fajr}</td>
                        <td>${allmonth.timings.Dhuhr}</td>
                        <td>${allmonth.timings.Asr}</td>
                        <td>${allmonth.timings.Maghrib}</td>
                        <td>${allmonth.timings.Isha}</td>
                    </tr>
        
        
        `
        }


    }).catch((err) =>{
        console.log(err.message)
    })



}

// Map Box
let boxmap;
function Mapdata(){
    fetch("./CityMa.json")
    .then((response) =>{
        if(!response.ok){
            throw new Error("Error"+response.status)
        }
        return response.json()

    })
    .then((data) =>{
        boxmap = L.map('boxmap').setView([32.0, -6.8], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            
        }).addTo(boxmap);
        data.forEach(city => {
            // Add marker
            const marker = L.marker([city.coordinates[0], city.coordinates[1]]).addTo(boxmap);
            marker.bindPopup(`
            <div style="text-align: center;">
            <h3>${city.name} : ${city.arabicName}</h3>
            <img src="${city.urlImage}" alt="${city.name}" width="100px">
            <p>${city.description}</p>
            <button  onclick="GetPrayertimes('${getdata.name}'); document.querySelector('.prayerTimes').scrollIntoView({behavior: 'smooth'});getallmonthly('${getdata.name}')"    style="padding: 18px; border: none; border-radius: 10px; background-color: rgb(0, 128, 255); margin: 20px;" >Prayer Times</button>
            </div>
            `);

            // Add red zone
            L.circle([city.coordinates[0], city.coordinates[1]], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 5000
            }).addTo(boxmap).bindPopup(`
            <div style="text-align: center;">
            <h3>Red Zone: ${city.name}</h3>
            <p>Area of interest around ${city.name}</p>
            </div>
            `);

            //click event to focus map
            marker.on('click', () => {
            boxmap.setView([city.coordinates[0], city.coordinates[1]], 10); // Zoom level 10
            });
        });

    
    })

    .catch((error) => console.log(error.message) )
    
}
Mapdata()








