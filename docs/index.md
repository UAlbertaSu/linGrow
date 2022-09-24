# Project Requriements 

## Executive Summary 

> linGrow, offers help for bilingual and multilingual children's development to achieve their potential and provides services through facilitated communication between parents, teachers, and researchers. Teachers in different schools are able to invite parents as a group and communicate with parents fluently with a built-in translation function in more than 15 languages. The application itself will adapt to more than 15 languages. In order to support multilingual families, there are study guides for simple English for children and parents who want to get better participation in their children's studies. Also, there are activities set on linGrow to help with language development.

---

## Project Glossary

* **Glossary Item 1**: Descriptions

* **Glossary Item 2**: Descriptions

---

## User Stories

### User Stories 1

> **As** an admin, **I want** to be able to manage schools, **so that** I can add/delete/update schools.
>
> **Acceptance Tests:**
>
> 1. Admin can access admin home.
> 2. Admin can access manage school menu.
> 3. Non-admin users cannot access admin home.
> 4. Non-admin users cannot access manage school menu.

### User Stories 2

> **As** an admin, **I want** to be able to manage users, **so that** I can add/delete/update users.
>
> **Acceptance Tests:**
>
> 1. Admin can access admin home.
> 2. Admin can access manage users menu.
> 3. Non-admin users cannot access admin home.
> 4. Non-admin users cannot access manage users menu.

### User Stories 3

### User Stories 4

### User Stories 5

### User Stories 6

### User Stories 7

### User Stories 8

### User Stories 9

### User Stories 10

### User Stories 11

### User Stories 12

### User Stories 13

### User Stories 14

### User Stories 15

### User Stories 16

### User Stories 17

### User Stories 18

### User Stories 19

### User Stories 20

### User Stories 21

---

## MoSCoW

### Must Have

* Text messaging
* Account (researcher/teacher/parent/admin)
* Parent grouping for researcher/teacher
* App-wide translation
* Language-development activities
* School management for admins

### Should Have

* Group messaging functionality
* User management for admins
* Pictogram
* Simple English guidelines

### Could Have

* Invite links for parent group
* Mark messages as important
* Text-to-speech

### Would Like But Won't Get

* Video messaging
* Voice messaging
* Speech-to-text

---

## Similar Products

> What follows is a list of available Machine Translation services. Each service features a Pricing and Languages section explaining their rates and supported languages, which is backed up with a current source from their website. After the services comparison, there is a “translation quality” section, giving context to each service’s accuracy.
>
> Note that all prices are in USD unless specified otherwise. 

### DEEPL

> **Pricing ([https://www.deepl.com/pro?cta=header-prices](https://www.deepl.com/pro?cta=header-prices)):** 
>
> - 0.5 million characters a month are FREE
> - 1m characters for $30.03 CAD
>
> **Languages ([https://www.deepl.com/docs-api/translate-text/response](https://www.deepl.com/docs-api/translate-text/response)):**
>
> - Has 29 languages 

### Google Cloud

> **Pricing ([https://cloud.google.com/translate/pricing](https://cloud.google.com/translate/pricing)):**
> 
> - 0.5m a month are FREE
> - 1m for $20, until 1 billion characters 
> 
> **Languages ([https://cloud.google.com/translate/docs/languages](https://cloud.google.com/translate/docs/languages)):**
> 
> - ~125 languages

### AWS

> **Pricing:**
> 
> - Standard translation is 2m a month are FREE FOR 12 MONTHS
> - Standard translation is $15 per 1m
> - Active custom translation “uses parallel data to customize the machine translated output”.
> - Active custom translation is 0.5m characters a month FREE FOR 2 MONTHS
> - Active custom translation is $60 per 1m
>
> **Languages ([https://aws.amazon.com/translate/faqs/](https://aws.amazon.com/translate/faqs/)):**
> 
> - 75 languages 

### AZURE

> **Pricing ([https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator/#pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator/#pricing)):**
> 
> - 2m a month are FREE FOR 12 MONTHS
> - Standard translation is $10 for 1m
> - Document translation is $15 for 1m
> - Custom translation
> - Text/document translation is $40 USD per 1m
> - Other options are also available, however they don’t seem relevant for us
>
> **Languages ([https://learn.microsoft.com/en-us/azure/cognitive-services/translator/language-support](https://learn.microsoft.com/en-us/azure/cognitive-services/translator/language-support)):** 
>
> - 100+ languages 

### SYSTRAN 

> **Pricing ([https://www.systran.net/en/plans-pricing/](https://www.systran.net/en/plans-pricing/)):**
> 
> - There’s a lot of different payment options, and there’s a 2 week free trial, but the cheapest is $5.49 a month for 150 pages of text (if 1 page is 1800 chars, this is 270 000 chars)
> - https://www.lexika-translations.com/blog/what-is-a-standard-page/
>
> **Languages ([https://www.systran.net/en/plans-pricing/](https://www.systran.net/en/plans-pricing/)):**
> 
> - 50 languages

### Yandex 

> **Pricing:**
> 
>> **Yandex translate ([https://translate.yandex.com/developers/offer/prices](https://translate.yandex.com/developers/offer/prices)):**
>>
>> - $15 for 1m, under 50m max
>>
>> **Yandex cloud translate ([https://cloud.yandex.com/en/docs/translate/pricing](https://cloud.yandex.com/en/docs/translate/pricing)):**
>>
>> - ~$4 for 1m
>
> **Languages ([https://yandex.com/support/translate-mobile/supported-langs.html](https://yandex.com/support/translate-mobile/supported-langs.html)):**
>
> - 102 languages

### ModernMT 

> **Pricing ([https://www.modernmt.com/pricing/#enterprises](https://www.modernmt.com/pricing/#enterprises)):**
>
> - Free FOR 1 MONTH
> - $8 per 1m, may have an hour turnaround time
>
> **Languages ([https://www.modernmt.com/translators/](https://www.modernmt.com/translators/)):**
>
> - 64 languages

### Supplemental Data

#### Bergamot Google Microsoft BLEU score comparison:

- Bergamot’s quality is slightly worse than Google and Microsoft, who got similar BLEU scores

[![supplemental_1](img/image2.png)](https://github.com/mozilla/firefox-translations-models/blob/main/evaluation/prod/results.md#evaluation-results)

#### Amazon Microsoft Google human and metric comparison:

- https://anno-ai.medium.com/evaluating-machine-translation-providers-68b8430debc3
- *“We were surprised to discover that the three providers showed comparable performance, and none really emerged as a clear winner. Although AWS slightly edged out the others in three out of four languages as scored by the metrics means, GCP received the highest human ratings in three out of four languages. Azure scored lower in metrics means (except in Chinese) and human ratings, but showed the lowest standard deviation across languages, indicating more consistency in translation quality.”*

#### 2021 State of Machine Translation Report:

[![supplemental_2](img/image1.png)](https://fs.hubspotusercontent00.net/hubfs/3317859/Intento%20State%20of%20Machine%20Translation%202021.pdf?utm_campaign=test%20campaign%20with%20an%20Elmentor%20form%2C%20WP&utm_medium=email&_hsenc=p2ANqtz-8xc2G0BNfhP3z6YUPhjSTrn8li94YYmTExx3KOVuR0g7snJdV9xOmVTRQBWrBpxpnJhK7lqlOJdTU7aOwIiSzJgc9KEQ&_hsmi=165411928&utm_content=165411928&utm_source=hs_automation&hsCtaTracking=08941eb0-c154-4f7a-b914-cb15a35ca735%7C17be86de-b20b-49c2-bec4-aa8e70f697b3)

[![supplemental_3](img/image4.png)](https://fs.hubspotusercontent00.net/hubfs/3317859/Intento%20State%20of%20Machine%20Translation%202021.pdf?utm_campaign=test%20campaign%20with%20an%20Elmentor%20form%2C%20WP&utm_medium=email&_hsenc=p2ANqtz-8xc2G0BNfhP3z6YUPhjSTrn8li94YYmTExx3KOVuR0g7snJdV9xOmVTRQBWrBpxpnJhK7lqlOJdTU7aOwIiSzJgc9KEQ&_hsmi=165411928&utm_content=165411928&utm_source=hs_automation&hsCtaTracking=08941eb0-c154-4f7a-b914-cb15a35ca735%7C17be86de-b20b-49c2-bec4-aa8e70f697b3)

#### Quick comparison of open source MT services:

- Generally slightly worse than the commercial systems 
- *“Open-source engines perform in the 2nd tier of commercial systems, except for en-es (on par with top-tier systems) and en-ko & en-ja (much worse than commercial systems).“*

[![supplemental_4](img/image3.png)](https://fs.hubspotusercontent00.net/hubfs/3317859/Intento%20State%20of%20Machine%20Translation%202021.pdf?utm_campaign=test%20campaign%20with%20an%20Elmentor%20form%2C%20WP&utm_medium=email&_hsenc=p2ANqtz-8xc2G0BNfhP3z6YUPhjSTrn8li94YYmTExx3KOVuR0g7snJdV9xOmVTRQBWrBpxpnJhK7lqlOJdTU7aOwIiSzJgc9KEQ&_hsmi=165411928&utm_content=165411928&utm_source=hs_automation&hsCtaTracking=08941eb0-c154-4f7a-b914-cb15a35ca735%7C17be86de-b20b-49c2-bec4-aa8e70f697b3)

---

## Open-source Projects

### LibreTranslate

- Open source translation API
- Easy to use, but likely a big headache to integrate, since it exists on a pre-existing system. 

### Moses

- Open source translation system that utilizes statistical methods 
- Strays very close to ML since it requires the training of the model. 
- Complex model but should provide a better and more accurate translation than the API.

### Apertium
 
- Is a free/open-source platform for developing rule-based machine translation systems!
- Will most likely give us the best translation since the developers (us) set the rule for how each language syntax should be formed. 
- The most work to use in terms of setting everything up. If we need at least 40 languages, that's 40 rules we have to write up. 
- Not recommended.

---

## Technical Resources

### Backend - Django REST, MongoDB

- [Django REST Documentation](https://www.django-rest-framework.org/tutorial/quickstart/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Django - MongoDB Integration](https://www.mongodb.com/compatibility/mongodb-and-django)

### Frontend - React

- [React Documentation](https://reactjs.org/docs/getting-started.html)

### Deployment - Cybera

- [Cybera Documentation](https://wiki.cybera.ca/#all-updates)
