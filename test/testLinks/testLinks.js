let pages = [
  "/",
  "/supporters",
  "/endowments",
  "/publications",
  "/sitemap",
  "/team",
  "/contact",
  "/about",
  "/research/affordable-housing-needs",
  "/research/preserving-rental-housing",
  "/research/housing-suitability-model",
  "/research/green-healthy-housing",
  "/research/children"
];

describe("test links on all pages", function () {
  it("should have working internal links", function () {
    let allInternalLinks = [];

    pages.forEach(page => {
      browser.url(page);
      let siteHomePage = getLocation();
      let links = getLinks();
      let { internalLinks } = mapHrefListToIntExtObj(siteHomePage, links);
      allInternalLinks = allInternalLinks.concat(internalLinks);
    });

    allInternalLinks = removeDuplicateObjs(allInternalLinks);

    testLinks(allInternalLinks, "INTERNAL");
  });

  it("should have working external links", function () {
    let allExternalLinks = [];

    pages.forEach(page => {
      browser.url(page);
      let siteHomePage = getLocation();
      let links = getLinks();
      let { externalLinks } = mapHrefListToIntExtObj(siteHomePage, links);
      allExternalLinks = allExternalLinks.concat(externalLinks);
    });

    allExternalLinks = removeDuplicateObjs(allExternalLinks);

    testLinks(allExternalLinks, "EXTERNAL");
  });
});

// takes in a baseUrl and a list of links, returns an obj
// {
//   internalLinks: [] // links that include the base url,
//   externalLinks: [] // links that DO NOT include the base url
// }
function mapHrefListToIntExtObj(baseUrl, links) {
  let internalLinks = links.filter(function (link) {
    return link.href.indexOf(baseUrl) !== -1;
  });
  let externalLinks = links.filter(function (link) {
    if (link.href.indexOf(baseUrl) === -1) {
      return link.href.indexOf("http") !== -1;
    }
  });
  return {
    internalLinks,
    externalLinks
  };
}

// returns array of all hrefs on a page
// {
//   href: href
//   text: link text
// }
function getLinks() {
  let linkTags = $$("a");
  let links = [];
  for (let i = 0; i < linkTags.length; i++) {
    let href = linkTags[i].getAttribute("href");
    let text = linkTags[i].getText();
    // don't add excel links
    if (!href.includes("style=excel")) {
      links.push({ href, text });
    }
  }
  return links;
}

function removeDuplicateObjs(arr) {
  return arr.filter((aObj, i, self) => {
    return (
      i ===
      self.findIndex(bObj => {
        return aObj.text === bObj.text && aObj.href === bObj.href;
      })
    );
  });
}

// returns baseUrl of website
function getLocation() {
  return browser.execute(function () {
    return window.location.origin;
  }).value;
}

function testLinks(links, linkType) {
  links.forEach(link => {
    browser.url(link.href);
    let title = browser.getTitle();
    // no title AND not a pdf
    if (!title && !link.href.includes(".pdf") && !link.href.includes('excel')) {
      throw new Error(
        `BROKEN ${linkType} LINK: ${link.href} TEXT: ${link.text}`
      );
    } else {
      // console.log(`WORKING ${linkType} LINK: ${link.href} TEXT: ${link.text}`);
    }
  });
}
