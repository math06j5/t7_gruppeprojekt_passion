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
       loadData();
       closeNav()

       //Klikevent for filtreringsknappen på mobil versionen
       document.querySelector("#FilterButton").addEventListener("click", openNav);
   }

   //En funktion der filtrerer destinationerne (json)
   function filtrerDestinationer() {
       console.log("filtrerDestinationer");
       //       document.querySelector("#Sidenav").style.width = "0"; //burger menu forsvinder ved at klikke på en filterknap
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


       //vis/filtrer randomfunktion
       if (filter == "random") {
           const randomTal = Math.floor(Math.random() * antalRows); // Random-funktionen laves for at kunne fremvise en tilfældig destination
           const destination = destinationer.feed.entry[randomTal]; // Den random destination kaldes

           document.querySelector("#detalje").style.display = "block";
           document.querySelector("#detalje img").src = `img/${destination.gsx$billede.$t}.jpg`;
           document.querySelector("#detalje img").alt = `Billede af ${destination.gsx$billede}`;
           document.querySelector("#detalje .beskrivelse-kort").textContent = " " + destination.gsx$kort.$t;


           document.querySelector("#detalje .luk").addEventListener("click", skjulDetaljeRandom);

           { // tjek hvilken kategori destinationerne har og sammenling med filter

               const klon = skabelon.cloneNode(true);

               klon.querySelector(".destination").style.backgroundImage = "url('img/" + destination.gsx$billede.$t + ".jpg')";
               klon.querySelector(".destination").style.backgroundSize = "cover";
               klon.querySelector(".navn").textContent = destination.gsx$destination.$t;

               klon.querySelector(".destination").addEventListener("click", () => {
                   visDetalje(destination);
               });

               placering.appendChild(klon);
           }

       }

       //vis/filtrer destinationer
       destinationer.feed.entry.forEach((destination) => { //Her looper vi igennem json (destinationerne)
           if (destination.gsx$kategori.$t == filter || filter == "alle") { // tjek hvilken kategori destinationerne har og sammenling med filter

               const klon = skabelon.cloneNode(true);
               klon.querySelector(".destination").style.backgroundImage = "url('img/" + destination.gsx$billede.$t + ".jpg')";
               klon.querySelector(".destination").style.backgroundSize = "cover";
               klon.querySelector(".navn").textContent = destination.gsx$destination.$t;

               klon.querySelector(".destination").addEventListener("click", () => {
                   visDetalje(destination);
               });

               placering.appendChild(klon);
           }
       })
   }


   //viser detalje visning
   function visDetalje(destination) {
       console.log(destination);
       document.querySelector("#detalje").style.display = "block";
       document.querySelector("#detalje img").src = `img/${destination.gsx$billede.$t}.jpg`;
       document.querySelector("#detalje img").alt = `Billede af ${destination.gsx$billede}`;
       document.querySelector("#detalje .navn").textContent = destination.gsx$destination.$t;
       document.querySelector("#detalje .beskrivelse-kort").textContent = " " + destination.gsx$kort.$t;
       document.querySelector("#detalje .luk").addEventListener("click", skjulDetalje);
   }

   //skjuler detalje visning
   function skjulDetalje() {
       console.log(skjulDetalje);
       document.querySelector("#detalje").style.display = "none";
   }

   //skjuler detalje visning for random knappen
   function skjulDetaljeRandom() {
       console.log(skjulDetaljeRandom);
       document.querySelector("#detalje").style.display = "none";
       filter = "alle";
       vis();
   }


   //****************** Burgermenu ******************//

   /* sæt bredden på burgermenuen til 50vw */
   function openNav() {
       document.querySelector("#Sidenav").style.width = "50vw";
       //       document.querySelector("#FilterButton").style.display = "none";
       document.querySelector(".closebtn").addEventListener("click", closeNav);

   }

   /* sæt bredden på burgermenuen til 0px */
   function closeNav() {
       console.log(closeNav);
       console.log(document.querySelector("#rejse_destinationer"));
       document.querySelector("#Sidenav").style.width = "0";
       //       document.querySelector("#FilterButton").style.display = "flex";
   }
