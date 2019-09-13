   document.addEventListener("DOMContentLoaded", start);

   const sheetID = "1pu_UGB944XHB1yirT3aJQOilal5rzWuCyXJH42ehIuQ";
   //const sheetID = "1skKi4NYctpp0zzVurux1XRiohfUcxHDd37XbzYvD7yE";
   const url = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;
   let destinationer;
   let filter = "alle";

   //Første funktion der kaldes efter DOM er loaded
   function start() {
       console.log(url);
       const filterKnapper = document.querySelectorAll("nav button");
       filterKnapper.forEach(knap => knap.addEventListener("click", filtrerDestinationer));
       skjulDetalje()
       loadData();
   }

   //En funktion der filtrerer retterne (json)
   function filtrerDestinationer() {
       filter = this.dataset.dest; //Sæt variable "filter" til aktuel værdi
       document.querySelector(".valgt").classList.remove("valgt"); // Fjern den valgte klasse på knappen
       this.classList.add("valgt"); //Marker den nye knap
       vis(); //Kald funktionen "vis" igen med nyt filter

   }

   //Funktion der henter data fra Googxle Sheet (via url)
   async function loadData() {
       const response = await fetch(url);
       destinationer = await response.json();
       vis();
   }

   //Funktion der viser retterne i liste view
   function vis() {
       console.log(destinationer)
       const skabelon = document.querySelector("template").content; // Select indhold af html-skabelonen (article)
       const placering = document.querySelector("#menukort"); // Container til artikler
       placering.textContent = ""; //Slet det der står i filter

       destinationer.feed.entry.forEach((destination) => { //Her looper vi igennem json (retterne)
           if (destination.gsx$kategori.$t == filter || filter == "alle") { // tjek hvilket køn retten har og sammenling med filter

               const klon = skabelon.cloneNode(true);

               let billednavn =

//               klon.querySelector(".destination").style.backgroundImage = "img/" + destination.gsx$billede.$t + ".jpg";;
//               klon.querySelector(".destination").style.backgroundSize = "cover";
               klon.querySelector(".dest-billede").src = "img/" + destination.gsx$billede.$t + ".jpg";
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
