# Guia de desplegament — CIFO CRM

Aquesta guia explica com funciona el desplegament del projecte amb Docker i GitHub Actions, i quins passos cal seguir per posar-lo en marxa al PC servidor del centre.

---

## Índex

1. [Visió general](#visió-general)
2. [Glossari de termes](#glossari-de-termes)
3. [Arquitectura del desplegament](#arquitectura-del-desplegament)
4. [Fitxers clau del repo](#fitxers-clau-del-repo)
5. [Flux complet CI/CD](#flux-complet-cicd)
6. [Posada en marxa al PC servidor (primer cop)](#posada-en-marxa-al-pc-servidor-primer-cop)
7. [Comandes del dia a dia](#comandes-del-dia-a-dia)
8. [Resolució de problemes](#resolució-de-problemes)

---

## Visió general

El projecte es desplega en un PC del centre amb Windows i Docker Desktop. La base de dades (MariaDB) i l'aplicació (Node.js) corren com a contenidors Docker.

Quan algú fa un canvi al codi i el mergega a `develop`:

1. **GitHub Actions** construeix una nova imatge Docker.
2. La puja a **GitHub Container Registry** (ghcr.io).
3. **Watchtower**, que corre al PC del centre, detecta la nova imatge i actualitza l'aplicació automàticament.

Resultat: cap intervenció manual al servidor després del primer arrencada.

---

## Glossari de termes

### Docker
Eina que empaqueta una aplicació amb totes les seves dependències en una unitat anomenada **contenidor**. Funciona igual a qualsevol ordinador (Windows, Mac, Linux).

### Imatge
La "recepta" empaquetada que conté el codi i tot el necessari per executar-lo. Una imatge no es modifica; quan vols actualitzar, construeixes una nova versió.

### Contenidor
Una imatge **en execució**. Pots tenir 1 imatge i múltiples contenidors basats en ella.

### Dockerfile
Fitxer de text amb les instruccions per construir una imatge. Defineix quina versió de Node usar, quins fitxers copiar, quina comanda executar al iniciar, etc.

### docker-compose
Eina per orquestrar **múltiples contenidors** alhora. En el nostre cas: l'app + MariaDB + Watchtower. Es defineix en un fitxer YAML.

### Volum
Espai de disc gestionat per Docker on es guarden dades **persistents** (la nostra base de dades, per exemple). Sobreviu a reinicis de contenidors.

### Registry
Servei que emmagatzema imatges Docker. Funciona com un "GitHub" però per imatges. Nosaltres usem **GitHub Container Registry (ghcr.io)**, que és el de GitHub.

### CI/CD
**Integració Contínua / Desplegament Continu**. Pràctica d'automatitzar el procés de build → test → publicació quan algú fa canvis al codi.

### GitHub Actions
Sistema de CI/CD integrat a GitHub. Defineixes un *workflow* (un fitxer YAML a `.github/workflows/`) i GitHub executa les passes automàticament quan passi alguna cosa (push, PR, etc.).

### Workflow
Una seqüència automatitzada de passos. En el nostre cas: quan algú fa push a `develop`, el workflow construeix la imatge i la puja al registry.

### Watchtower
Contenidor que vigila altres contenidors. Cada X minuts comprova si hi ha una imatge nova al registry; si la troba, baixa la nova i reinicia el contenidor sense perdre dades.

### Healthcheck
Comprovació periòdica que un contenidor fa per saber si està funcionant. Si falla, Docker el reinicia.

---

## Arquitectura del desplegament

```
┌──────────────────────────────────────────────────────────────┐
│  Desenvolupador local                                        │
│  - Edita codi                                                │
│  - Fa PR a develop                                           │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼ (merge)
┌──────────────────────────────────────────────────────────────┐
│  GitHub                                                      │
│  - Detecta push a develop                                    │
│  - GitHub Actions construeix imatge Docker                   │
│  - Puja imatge a ghcr.io/cifo-ifcd0111-2526/cifo_crm_project │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼ (cada 5 min)
┌──────────────────────────────────────────────────────────────┐
│  PC servidor del centre (Windows + Docker Desktop)           │
│  ┌─────────────┐  ┌─────────┐  ┌─────────────┐               │
│  │ watchtower  │─→│   app   │──│      db     │ (volum)       │
│  └─────────────┘  └─────────┘  └─────────────┘               │
│         ↑              ↑                                     │
│         └─ comprova    └─ Node.js (port 80 → 3000 intern)    │
│            ghcr.io                                           │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
                  Usuaris LAN del centre
                  http://10.199.25.100
```

---

## Fitxers clau del repo

| Fitxer | Què fa |
|---|---|
| `Dockerfile` | Recepta per construir la imatge de l'app. |
| `.dockerignore` | Llista de fitxers que **no** s'inclouen a la imatge (node_modules, .env, .git…). |
| `docker-compose.yml` | Configuració per **desenvolupament local**. Construeix l'app des del Dockerfile. |
| `docker-compose.prod.yml` | Configuració per **producció** al PC del centre. Usa la imatge de ghcr.io. |
| `.github/workflows/docker-publish.yml` | Workflow que construeix i publica la imatge en cada push a `develop`. |

---

## Flux complet CI/CD

1. Un alumne fa una PR amb canvis.
2. Després de revisar i provar, es mergega a `develop`.
3. GitHub detecta el push i executa el workflow `docker-publish.yml`:
   - Fa checkout del codi.
   - Fa login a `ghcr.io` amb el token automàtic.
   - Construeix la imatge segons el `Dockerfile`.
   - Etiqueta la imatge com `latest` i `sha-XXXX` (hash del commit).
   - Puja la imatge al registry.
4. Watchtower del PC servidor (cada 5 min):
   - Comprova si hi ha imatge nova al registry.
   - Si n'hi ha, la baixa.
   - Reinicia el contenidor `app` amb la nova imatge.
   - **No toca el contenidor `db` ni el seu volum** → les dades es conserven.

---

## Posada en marxa al PC servidor (primer cop)

### Requisits previs

- Windows amb privilegis d'administrador.
- Docker Desktop instal·lat i funcionant (icona de la balena verda).
- Connexió a internet (per baixar imatges la primera vegada).

### Passos

#### 1. Crear carpeta del projecte

```powershell
mkdir C:\crm-cifo
cd C:\crm-cifo
```

#### 2. Descarregar el `docker-compose.prod.yml`

```powershell
curl -o docker-compose.prod.yml https://raw.githubusercontent.com/CIFO-IFCD0111-2526/CIFO_CRM_project/develop/docker-compose.prod.yml
```

#### 3. Crear el fitxer `.env`

Crear un fitxer `.env` a `C:\crm-cifo\` amb aquest contingut (substituir valors reals):

```env
DB_NAME=cifo_crm
DB_PASSWORD=ESCRIU_AQUI_UN_PASSWORD_FORT
SESSION_SECRET=ESCRIU_AQUI_UN_STRING_LLARG_ALEATORI
NODE_ENV=production
SMTP_HOST=
SMTP_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
```

> **Important:** el `.env` no es puja a GitHub mai. Conté secrets.

#### 4. Arrencar els contenidors

```powershell
docker compose -f docker-compose.prod.yml up -d
```

`-d` significa *detached*: els contenidors corren al fons.

La primera vegada baixarà:
- Imatge de MariaDB (~250 MB).
- Imatge de l'aplicació des de ghcr.io.
- Imatge de Watchtower.

#### 5. Comprovar que tot funciona

```powershell
docker compose -f docker-compose.prod.yml ps
```

Hauries de veure 3 contenidors amb estat `Up`:

```
crm-cifo-app-1          Up (healthy)
crm-cifo-db-1           Up (healthy)
crm-cifo-watchtower-1   Up
```

#### 6. Accés des del navegador

Des de qualsevol equip de la LAN del centre:

```
http://10.199.25.100
```

(la IP fixa del PC servidor)

---

## Comandes del dia a dia

Totes s'executen des de `C:\crm-cifo` al PC servidor.

### Veure estat dels contenidors

```powershell
docker compose -f docker-compose.prod.yml ps
```

### Veure logs

```powershell
docker compose -f docker-compose.prod.yml logs app --tail 50
docker compose -f docker-compose.prod.yml logs db --tail 50
docker compose -f docker-compose.prod.yml logs watchtower --tail 50
```

### Reiniciar tot

```powershell
docker compose -f docker-compose.prod.yml restart
```

### Aturar tot (sense esborrar dades)

```powershell
docker compose -f docker-compose.prod.yml down
```

### Aturar i **esborrar** tot (incloent BD)

```powershell
docker compose -f docker-compose.prod.yml down -v
```

> Compte: l'opció `-v` esborra el volum de la BD. Només per casos extrems.

### Forçar actualització manual sense esperar Watchtower

```powershell
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Si canvia el `docker-compose.prod.yml` al repo

Watchtower **no actualitza** aquest fitxer (només la imatge de l'app). Cal descarregar-lo manualment:

```powershell
curl -o docker-compose.prod.yml https://raw.githubusercontent.com/CIFO-IFCD0111-2526/CIFO_CRM_project/develop/docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d
```

---

## Resolució de problemes

### `unauthorized` en fer `docker compose up`

La imatge a ghcr.io està com a privada i Docker no pot baixar-la. Cal fer-la pública:

1. Anar a https://github.com/orgs/CIFO-IFCD0111-2526/packages
2. Click al paquet `cifo_crm_project`.
3. Package settings → Danger zone → Change visibility → **Public**.

Si l'opció surt deshabilitada, primer cal habilitar paquets públics a la configuració de l'organització: https://github.com/organizations/CIFO-IFCD0111-2526/settings/packages

### `port already in use` al port 80

Algun servei de Windows està ocupant el port 80 (típicament IIS o WWW Publishing Service). Opcions:

- Aturar el servei: `Services.msc` → `World Wide Web Publishing Service` → Stop.
- O canviar al port 8080 en el `docker-compose.prod.yml`:
  ```yaml
  ports:
    - "8080:3000"
  ```
  Llavors la URL passa a ser `http://10.199.25.100:8080`.

### `client version is too old` (Watchtower)

El fork antic `containrrr/watchtower` està arxivat. Comprovar que el `docker-compose.prod.yml` usa `nickfedor/watchtower:latest`.

### L'app diu Error 500 en accions normals

Comprovar logs:

```powershell
docker compose -f docker-compose.prod.yml logs app --tail 50
```

Si veus `SequelizeValidationError`, no és un error del servidor sinó un input que no compleix les validacions del model. Consulta la issue #95.

### La BD no es manté entre reinicis

Comprovar que existeix el volum:

```powershell
docker volume ls | findstr crm
```

Si fas `docker compose down -v` esborres el volum. Per parar sense esborrar dades, usar `down` sense `-v`.

### Veure la IP del PC servidor

```powershell
ipconfig
```

Buscar "Adaptador de Ethernet" o "Wi-Fi" → IPv4 Address.

---

## Manteniment recomanat

### Backups de la base de dades

Encara no està automatitzat. Comanda manual:

```powershell
docker exec crm-cifo-db-1 mariadb-dump -uroot -pPASSWORD cifo_crm > backup.sql
```

Convindria fer una tasca programada de Windows que executi això cada nit i copiï el fitxer a un altre disc / NAS / núvol.

### Monitorització

Comprovar regularment:
- Espai en disc del PC servidor.
- Logs d'errors a `docker compose logs`.
- Que els 3 contenidors estiguin `Up`.

---

## Referències

- [Documentació oficial de Docker](https://docs.docker.com/)
- [Documentació de docker-compose](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Watchtower (fork mantingut)](https://github.com/nickfedor/watchtower)
