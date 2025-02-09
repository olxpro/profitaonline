(function() {
    function obfuscate(force) {
        let text = sourceTextInp.value;
    
        if (localStorage) {
            localStorage.setItem('source_text', text);
        }
    
        if (text === lastText && !force) {
            return;
        }
    
        lastText = text;
    
        let obfText;
        if (obfuscateAdultSwearing.checked) {
            obfText = obfuscateAdultSwearingWords(text);
        } else {
            obfText = window.obfuscator.obfuscate(text);
        }
    
        resultTextInp.value = obfText;
    
        if (obCopy.checked)
            navigator.clipboard.writeText(obfText);
    }

    const adultWords =
        new Set((
          'fuck,milf,anal,bbw,cum,pussy,cunt,' +
          'xxx,porn,squirt,swinger,tits,hardcore,masturbation,' +
          'fucking,sexy,ass,gangbang,pussy,cock,orgasm,gay,' +
          'blowjob,cumshot,nude,seduction,pornstar,busty,' +
          'threesome,handjob,panties,xxx,naked,adult,sexual,masturbating,' +
          'hentai,cumshow'
    ).split(','));

    const swearWords = new Set((
          "cumbubble,fuck,fuck you,shitbag,shit,piss off,asshole,dickweed,cunt," +
          "son of a bitch,fuck trumpet,bastard,bitch,damn,bollocks,bugger," +
          "cocknose,bloody hell,knobhead,choad,bitchtits,crikey,rubbish," +
          "pissflaps,shag,wanker,talking the piss,twat,arsebadger,jizzcock," +
          "cumdumpster,shitmagnet,scrote,twatwaffle,thundercunt,dickhead," +
          "shitpouch,jizzstain,nonce,pisskidney,wazzock,cumwipe,fanny," +
          "bellend,pisswizard,knobjockey,cuntpuddle,dickweasel,quim,bawbag," +
          "fuckwit,tosspot,cockwomble,twat face,cack,flange,clunge," +
          "dickfucker,fannyflaps,wankface,shithouse,gobshite,jizzbreath," +
          "todger,nutsack"
    ).split(','));
    
    function obfuscateAdultSwearingWords(text) {
        const regex = /(\w+)|(\W+)/g; // Regular expression to match words and non-word characters (delimiters)
        const items = text.match(regex); // Match words and delimiters

        return items.map(item => {
            // Check if the item is a word (contains word characters)
            if (/\w/.test(item)) {
                let itemLc = item.toLowerCase();

                if (adultWords.has(itemLc) || swearWords.has(itemLc)) {
                    return window.obfuscator.obfuscate(item);
                }
                return item;
            } else {
                // If it's a delimiter, keep it as is
                return item;
            }
        }).join('');
    }

    function resizeTextareas() {
        let rows = Math.max(10, sourceTextInp.value.split('\n').length + 1);

        sourceTextInp.rows = resultTextInp.rows = rows;
    }

    let sourceTextInp = document.getElementById('source_text');
    let resultTextInp = document.getElementById('obfuscated_text');
    let obCopy = document.getElementById('ob_copy');
    let lastText = '';

    if (localStorage) {
        sourceTextInp.value = localStorage.getItem('source_text');
    }

    sourceTextInp.addEventListener('input', obfuscate);
    sourceTextInp.addEventListener('change', obfuscate);

    sourceTextInp.addEventListener('input', resizeTextareas);
    sourceTextInp.addEventListener('change', resizeTextareas);

    Array.from(document.querySelectorAll("input[type='radio'][name='obfuscator']")).forEach(i => i.addEventListener('click', e => {
        window.obfuscator = window[i.dataset.obfuscator];
        obfuscate(true);
    }));

    let hash = location.hash.substring(1);
    
    if (/^[a-z]$/.test(hash)) {
        let startModeElem = document.querySelector("input[type='radio'][name='obfuscator']#ob_" + hash);
    
        if (startModeElem) {
            startModeElem.click();
        }
    }
    else {
        window.obfuscator = window.weakObfuscator;
    }

    let obfuscateAdultSwearing = document.getElementById('obfuscate_adult_swearing');

    // Add event listener for the new checkbox
    obfuscateAdultSwearing.addEventListener('change', obfuscate);

    obfuscate(true);
})();
