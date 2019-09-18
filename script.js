   document.addEventListener("DOMContentLoaded", start);

   const sheetID = "1pu_UGB944XHB1yirT3aJQOilal5rzWuCyXJH42ehIuQ";
   //const sheetID = "1skKi4NYctpp0zzVurux1XRiohfUcxHDd37XbzYvD7yE";
   const url = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;
   let destinationer;
   let filter = "alle"; //
   let antalRows; // Vi definerer antallet af data-linjer for at kunne lave random-funktionen


   //Første funktion der kaldes efter DOM er loaded
   function start() {
       console.log(url);
       const filterKnapper = document.querySelectorAll(".filter button, .Sidenav .filter, #random");
       filterKnapper.forEach(knap => knap.addEventListener("click", filtrerDestinationer));
       //skjulDetalje();
       loadData();
       closeNav()

       //Klikevent for filtreringsknappen på mobil versionen
       document.querySelector("#FilterButton").addEventListener("click", openNav);
   }

   //En funktion der filtrerer retterne (json)
   function filtrerDestinationer() {
       console.log("hej")
       filter = this.dataset.dest; //Sæt variable "filter" til aktuel værdi
       document.querySelector(".valgt").classList.remove("valgt"); // Fjern den valgte klasse på knappen
       this.classList.add("valgt"); //Marker den nye knap
       vis(); //Kald funktionen "vis" igen med nyt filter

   }

   //Funktion der henter data fra Google Sheet (via url)
   async function loadData() {
       const response = await fetch(url);
       destinationer = await response.json();
       vis();
   }

   //Funktion der viser destinationer i liste view
   function vis() {
       antalRows = destinationer.feed.entry.length; // Her definerer vi antallet af linjer i vores feed
       const skabelon = document.querySelector("template").content; // Select indhold af html-skabelonen (article)
       const placering = document.querySelector("#rejse_destinationer"); // Container til artikler
       placering.textContent = ""; //Slet det der står i filter


       if (filter == "random") {
           const randomTal = Math.floor(Math.random() * antalRows); // Random-funktionen laves for at kunne fremvise en tilfældig destination
           const destination = destinationer.feed.entry[randomTal]; // Den random destination kaldes

           document.querySelector("#detalje").style.display = "block";
           document.querySelector("#detalje img").src = `img/${destination.gsx$billede.$t}.jpg`;
           document.querySelector("#detalje img").alt = `Billede af ${destination.gsx$billede}`;
           document.querySelector("#detalje .beskrivelse-kort").textContent = " " + destination.gsx$kort.$t;


           document.querySelector("#detalje .luk").addEventListener("click", skjulDetaljeRandom);

           { // tjek hvilket køn retten har og sammenling med filter

               const klon = skabelon.cloneNode(true);

               //               klon.querySelector(".destination").style.backgroundImage = "img/" + destination.gsx$billede.$t + ".jpg";;
               //               klon.querySelector(".destination").style.backgroundImage = "url('img/alaska.jpg')";;
               klon.querySelector(".destination").style.backgroundImage = "url('img/" + destination.gsx$billede.$t + ".jpg')";
               klon.querySelector(".destination").style.backgroundSize = "cover";
               //               klon.querySelector(".dest-billede").src = "img/" + destination.gsx$billede.$t + ".jpg";
               klon.querySelector(".navn").textContent = destination.gsx$destination.$t;

               klon.querySelector(".destination").addEventListener("click", () => {
                   visDetalje(destination);
               });

               placering.appendChild(klon);
           }

       }

       destinationer.feed.entry.forEach((destination) => { //Her looper vi igennem json (retterne)
           if (destination.gsx$kategori.$t == filter || filter == "alle") { // tjek hvilket køn retten har og sammenling med filter

               const klon = skabelon.cloneNode(true);

               //               klon.querySelector(".destination").style.backgroundImage = "img/" + destination.gsx$billede.$t + ".jpg";;
               //               klon.querySelector(".destination").style.backgroundImage = "url('img/alaska.jpg')";;
               klon.querySelector(".destination").style.backgroundImage = "url('img/" + destination.gsx$billede.$t + ".jpg')";
               klon.querySelector(".destination").style.backgroundSize = "cover";
               //               klon.querySelector(".dest-billede").src = "img/" + destination.gsx$billede.$t + ".jpg";
               klon.querySelector(".navn").textContent = destination.gsx$destination.$t;

               klon.querySelector(".destination").addEventListener("click", () => {
                   visDetalje(destination);
               });

               placering.appendChild(klon);
           }
       })
   }



   function visDetalje(destination) {
       console.log(destination);
       document.querySelector("#detalje").style.display = "block";
       document.querySelector("#detalje img").src = `img/${destination.gsx$billede.$t}.jpg`;
       document.querySelector("#detalje img").alt = `Billede af ${destination.gsx$billede}`;
       document.querySelector("#detalje .beskrivelse-kort").textContent = " " + destination.gsx$kort.$t;
       //       document.querySelector("#detalje .pris").textContent = destination.gsx$pris.$t + " kr.";

       document.querySelector("#detalje .luk").addEventListener("click", skjulDetalje);
   }

   function skjulDetalje() {
       console.log(skjulDetalje);
       document.querySelector("#detalje").style.display = "none";
   }




   //******************

   /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
   function openNav() {
       document.querySelector("#Sidenav").style.width = "250px";
       //       document.style.backgroundColor = "rgba(0,0,0,0.4)";
       document.querySelector(".closebtn").addEventListener("click", closeNav);
   }

   /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
   function closeNav() {
       console.log(document.querySelector("#rejse_destinationer"));
       document.querySelector("#Sidenav").style.width = "0";
       //       document.style.backgroundColor = "white";
   }


   function skjulDetaljeRandom() {
       console.log(skjulDetaljeRandom);
       document.querySelector("#detalje").style.display = "none";
       filter = "alle";
       vis();
   }
