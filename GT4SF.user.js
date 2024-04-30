// ==UserScript==
// @name         Salesforce Helper Script
// @namespace    http://tampermonkey.net/
// @version      0.61
// @description  Salesforce automation
// @author       You
// @match        https://hp.my.salesforce.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function extractAndStoreData() {
        let firstDivContent = document.querySelector('#cas2_ileinner').textContent;
        let numberPattern = /\d+/; // Regular expression for extracting numbers
        let extractedNumber = firstDivContent.match(numberPattern)[0];

        console.log(extractedNumber);

        let emailAnchor = document.querySelector('[id="00NG00000064bdl_ilecell"]');
        let email = emailAnchor.textContent;

        console.log(email);

        sessionStorage.setItem('extractedNumber', extractedNumber);
        sessionStorage.setItem('email', "$"+email);
        sessionStorage.setItem('dataExtractionInitiated', 'true'); // Flag

        // Click the Clone button
        let cloneButton = document.querySelector('input[title="Clone"]');
        if (cloneButton) cloneButton.click();
    }

    function setDataFromSessionStorage() {
        let storedNumber = sessionStorage.getItem('extractedNumber');
        let storedEmail = sessionStorage.getItem('email');
        let extractionFlag = sessionStorage.getItem('dataExtractionInitiated');

        if (extractionFlag === 'true') {
            console.log(storedNumber, storedEmail);

            let numberInput = document.querySelector('#CF00NG00000064bej');
            if (numberInput) numberInput.value = storedNumber;
            let emailInput = document.querySelector('[id="00NG00000064bdl"]');
            if (emailInput) emailInput.value = storedEmail;
            let ccInput = document.querySelector('[id="00N2700000D58Nz"]');
            if (ccInput && ccInput.length>0) ccInput.value = ccInput.value.split(";").map(part => "$" + part).join(";");
            let retainInput = document.querySelector('[id="00NG00000064bdk"]');
            if (retainInput) retainInput.checked = true;


            sessionStorage.removeItem('dataExtractionInitiated'); // Remove flag
        }
    }

    function addButton(name, onClickFunction) {
        let btn = document.createElement("button");
        btn.innerText = name;
        btn.style.position = "fixed";
        btn.style.top = "00px";
        btn.style.right = "500px";
        btn.onclick = onClickFunction;
        document.body.appendChild(btn);
    }

    // Check if we're on the new page after clicking the Clone button
    setDataFromSessionStorage();

    // Add button for initial extraction only if the Clone button exists and the extraction flag doesn't exist
    let cloneButton = document.querySelector('input[title="Clone"]');
    if (cloneButton && !sessionStorage.getItem('dataExtractionInitiated')) {
        addButton("GT Clone", extractAndStoreData);
    }
})();
