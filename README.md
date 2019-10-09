# Fundimmo - Test project application 



## Description : 

Ce projet est la réalisation du projet tel qu'il est décrit dans l'énnoncé envoyé par mail par M. Jeremie Benmoussa.

------



## Composition : 

Le projet a été réalisé avec le composant Docker qui a permis l'instanciation de 4 serveurs Linux indépendants : 

1. **Backend** - Exposition des API's et de contrôle de gestion - Réalisé en NodeJS / Express - Port 3000
2. **DB** - Serveur MySQL pour le stockage des données - Serveur dockerisé - Port 3306
3. **Adminer** - Serveur NGinx nous permettant de piloter la BD grâce à l'interface UI - Serveur dockerisé - Port 8888
4. **FrontEnd** - Interface utilisateur permettant de naviguer entre les différents pays - VueJS WebPack avec un Reverse Proxy Nginx pour l'exposition des fichiers statics générés par WebPack - VueJS = Port 3000, Nginx reverse 3000 to 8080)



## Installation : 

### Pre-requis : 

Docker + Docker-compose.

### Mise en place :

En vous situant à la racine du projet, une seule commande suffit pour monter tout les serveurs en question :

```bash
$ docker-compose up --build --force-recreate --remove-orphans
```



## Utilisation :

Dés que les serveurs ont finis d'être buildés et lancés, vous pourrez alors consulter le front via http://localhost:8080.
Le Backend est quant à lui accessible via http://localhost:3000. 

**/I\ ATTENTION** : Au premier lancement, le serveur vérifiera l'existance des pays dans la BD, dans le cas où ils n'existent pas, il fera appel à l'API '/import-countries' pour la consommation de l'API d'import des pays dans la BD. Il suffira alors réactualiser la page une nouvelle fois pour voir les données provenant de la base de données s'afficher.

## Postman :

Les enveloppes Postman se situent à la racine du projet : /postman/Fundimmo.postman_collection.json et contiennent toutes les enveloppes d'API's du serveur pour pouvoir les tester juste en appuyant sur "Send".

------

Merci.

Youssef EL Gharbaoui.
