<script setup lang="ts">
import SideBar from '../components/SideBar.vue';
import TopBar from '../components/TopBar.vue';
import Popup from '../components/Popup.vue';
import { removeClient,getClient,editClient,editClientProperty } from '../dao';
import {Client,calculateAge,verifyClientInfos,formatClient,formatDate, getCurrentDate} from '../tools'
</script>

<template>
<div class="page">
    <TopBar :showReturnBtn="false" v-if="editMode"/>
    <TopBar previousPage="/search-client" v-else/>
    <div class="page-content">
      <SideBar />
      <div class="content">
        <div class="title">
          <p v-if="!editMode">{{ client.firstName }} {{ client.lastName }}</p>
          <div class="input-group" v-if="editMode" style="padding-bottom: 5vh;">
            <input type="text" class="input input-half" name="lastName" placeholder="prenom" v-model.trim="client.firstName">
            <input type="text" class="input input-half" name="firstName" placeholder="nom" v-model.trim="client.lastName" >
          </div>
        </div>
        <div class="informations">
          <div class="lastConsultation info-block" v-if="client.lastVisitDate != '' || editMode">
            <div class="info-line">
              <p class="info-title">Dernier rendez-vous</p>
              <div class="fast-edit-btn"><button class="btn resetPts" @click="onRefreshLastVisit"><img class="icon" src="../img/refresh.png" alt="Refresh icons created by Dave Gandy - Flaticon"></button></div> 
            </div>
            <p class="info">{{ client.lastVisitDate }}</p>
          </div>
          <div class="loyaltyPoints info-block">
            <div class="info-line">
              <div><p class="info-title">Points de fidélité</p></div>
              <div class="fast-edit-btn"><button class="btn resetPts" @click="onResetLP"><img class="icon" src="../img/refresh.png" alt="Refresh icons created by Dave Gandy - Flaticon"></button></div>
            </div> 
            <div class="info-line">
              <div class="fast-edit-btn"><button class="btn removePts" @click="removeLP"><img class="icon" src="../img/moins.png" alt="Minus icons created by Freepik - Flaticon"></button></div>
              <div><p class="info">{{ client.loyaltyPoints }}</p></div>
              <div class="fast-edit-btn"><button class="btn addPts" @click="addLP"><img class="icon" src="../img/plus.png" alt="Plus icons created by srip - Flaticon"></button></div>
            </div>     
          </div>
          <div class="birthday info-block" v-if="client.birthday != '' || editMode">
            <p class="info-title">Age</p>
            <p class="info" v-if="!editMode">{{ calculateAge(client.birthday) }} ans ({{ client.birthday }})</p>
            <input type="text" class="input" name="birthday" onfocus="(this.type='date')" onblur="(this.type='text')" placeholder="date de naissance" v-model.trim.trim="client.birthday" @blur="client.birthday = formatDate(client.birthday)" v-if="editMode">
          </div>
          <div class="gender radio-info-block" v-if="client.gender != '' || editMode">
            <p class="info-title">Genre</p>
            <p class="info" v-if="!editMode">{{ client.gender }}</p>
            <div class="radio-input" v-if="editMode">
                <div class="radio"><input type="radio" name="gender" value="Homme" v-model="client.gender"> Homme</div>
                <div class="radio"><input type="radio" name="gender" value="Femme" v-model="client.gender"> Femme</div>
            </div>
          </div>
          <div class="funcion info-block" v-if="client.job != '' || editMode">
            <p class="info-title">Situation</p>
            <p class="info" v-if="!editMode">{{ client.job }}</p>
            <input type="text" class="input" name="job" v-model.trim="client.job" v-if="editMode">
          </div>
          <div class="address info-block" v-if="client.address != '' || editMode">
            <p class="info-title">Adresse</p>
            <p class="info" v-if="!editMode">{{ client.address }}</p>
            <input type="text" class="input input-half" name="address" v-model.trim="client.address" v-if="editMode">
          </div>
          <div class="city info-block" v-if="client.city != '' || editMode">
            <p class="info-title">Ville</p>
            <p class="info" v-if="!editMode">{{ client.city }}</p>
            <input type="text" class="input input-half" name="city" v-model.trim="client.city" v-if="editMode">
          </div>
          <div class="cp info-block" v-if="client.postalCode != '' || editMode">
            <p class="info-title">Code Postal</p>
            <p class="info" v-if="!editMode">{{ client.postalCode }}</p>
            <input type="text" class="input input-half" name="postalCode" v-model.trim="client.postalCode" v-if="editMode">
          </div>
          <div class="email info-block" v-if="client.email != '' || editMode">
            <div><p class="info-title">Email</p></div>
            <div><p class="info" v-if="!editMode">{{ client.email }}</p></div>
            <input type="email" class="input" name="email" v-model.trim="client.email" v-if="editMode">
          </div>
          <div class="telephone info-block" v-if="client.telephone != '' || editMode">
            <div><p class="info-title">Téléphone</p></div>
            <div><p class="info" v-if="!editMode">{{ client.telephone }}</p></div>
            <input type="tel" class="input" name="telephone" v-model.trim="client.telephone" v-if="editMode">
          </div>
          <div class="specifications info-block" v-if="client.specifications != '' || editMode">
            <div><p class="info-title">Spécifications</p></div>
            <div style="width: 100%;"><p class="info textarea-display" v-if="!editMode">{{ client.specifications }}</p></div>
            <textarea class="text-area" placeholder="Spécifications sur le client" v-model.trim="client.specifications" v-if="editMode" ></textarea>
          </div>
          <div class="registrationDate info-block" v-if="client.registrationDate != '' || editMode">
            <div><p class="info-title">Date d'inscription</p></div>
            <div><p class="info" v-if="!editMode">{{ client.registrationDate }}</p></div>
            <input type="text" class="input" name="registrationDate" onfocus="(this.type='date')" onblur="(this.type='text')" placeholder="date d'inscription" v-model.trim.trim="client.registrationDate" @blur="client.registrationDate = formatDate(client.registrationDate)" v-if="editMode">
          </div>
        </div>
        <div class="btnGroup" v-if="!editMode">
          <div class="delBtn"><button @click="onRemove" class="btn">Supprimer le client</button></div>
          <div class="editBtn"><button @click="switchEditMode(true)" class="btn">Modifier le client</button></div>
        </div>
        <div class="btnGroup" v-else>
          <div class="cancelBtn"><button @click="onCancelEdit" class="btn">Annuler</button></div>
          <div class="validBtn"><button @click="onApply" class="btn">Valider</button></div>
        </div>
        
      </div>
      <SideBar />
      <Popup v-if="showPopup" :confirmation=confirmationPopup :msg=popupMsg :acceptMethod=popupAcceptMethod :cancelMethod=popupCancelMethod />
    </div>
</div>
</template>

<script lang="ts">
export default {
    data() {
      return {
        client : {} as Client,
        editMode : false as boolean,
        showPopup : false as boolean,
        popupMsg : "" as string,
        popupAcceptMethod : this.hidePopup() as Function,
        popupCancelMethod : this.hidePopup() as Function,
        confirmationPopup : true as boolean
      }
    },
    props: {
      clientId:{
        type: Number,
        required: true,
        default: -1,
      }
    },
    methods:{
      onResetLP(){
        let msg = "Voulez-vous vraiment réinitialiser les points de fidélité de ce client ?";
        this.changeAcceptPopupMethod(this.resetLP);
        this.changeCancelPopupMethod(this.hidePopup);
        this.setPopup(msg,true);
      },
      onRefreshLastVisit(){
        let msg = "Êtes-vous sûr de vouloir actualiser la date de dernière visite du client ?";
        this.changeAcceptPopupMethod(this.refreshLastVisit);
        this.changeCancelPopupMethod(this.hidePopup);
        this.setPopup(msg,true);
      },
      addLP(){
        editClientProperty(this.client.id,"loyaltyPoints",this.client.loyaltyPoints+1);
        this.client.loyaltyPoints++;
      },
      removeLP(){
        if(this.client.loyaltyPoints > 0){
          editClientProperty(this.client.id,"loyaltyPoints",this.client.loyaltyPoints-1);
          this.client.loyaltyPoints--;
        }
      },
      resetLP(){
        editClientProperty(this.client.id,"loyaltyPoints",0);
        this.client.loyaltyPoints = 0;
        this.hidePopup();
      },
      refreshLastVisit(){
        let today = getCurrentDate();
        editClientProperty(this.client.id,"lastVisitDate",today);
        this.client.lastVisitDate = today;
        this.hidePopup();
      },
      onRemove(){
        let msg = "Voulez vous vraiment supprimer le client " + this.client.firstName + " " + this.client.lastName + " ?";
        msg += "<br><br>Cette action est définitive !";

        this.changeAcceptPopupMethod(this.applyRemove);
        this.changeCancelPopupMethod(this.hidePopup);

        this.setPopup(msg,true);
      },
      applyRemove(){
        let msg = "Le client " + this.client.firstName + " " + this.client.lastName + " a été supprimé ! ";

        removeClient(this.clientId);
        this.setPopup(msg);
        this.changeAcceptPopupMethod(this.appliedRemove);
      },
      appliedRemove(){
        this.$router.push({name:'menu'});
      },
      switchEditMode(active:boolean){
        this.editMode = active;
      },
      onCancelEdit(){
        let msg = "Voulez vous vraiment annuler les changements effectués ? ";

        this.changeAcceptPopupMethod(this.applyCancelEdit);
        this.changeCancelPopupMethod(this.hidePopup);
        this.setPopup(msg,true);
      },
      applyCancelEdit(){
        this.reloadPage();
      },
      onApply(){       
        let msg = "Voulez vous vraiment appliquer les changements effectués sur le client ?";

        let errorList = verifyClientInfos(this.client);
        if(errorList.length > 0){
          this.setPopup(errorList[0]);
          this.changeAcceptPopupMethod(this.hidePopup);
        }
        else{
          this.changeAcceptPopupMethod(this.applyChanges);
          this.changeCancelPopupMethod(this.hidePopup);
          this.setPopup(msg,true);
        }
      },
      applyChanges(){
        this.client = formatClient(this.client);
        editClient(this.clientId, this.client);
        this.reloadPage();
      },
      reloadPage(){
        location.reload();
      },
      hidePopup(){
        this.showPopup = false;
      },
      changeAcceptPopupMethod(method:Function){
        this.popupAcceptMethod = method;
      },
      changeCancelPopupMethod(method:Function){
        this.popupCancelMethod = method;
      },
      setPopup(msg:string,confirmation:boolean = false){
        this.popupMsg = msg;
        this.showPopup = true;
        this.confirmationPopup = confirmation;
      },
    },
    beforeMount(){
      getClient(this.clientId).then((client) => {
        this.client = client;
      });
    },
};
</script>

<style scoped>
.informations {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 80%;
}

.textarea-display {
  /* text-align: left !important; */
  white-space: pre-line;
  word-wrap: break-word;
}

.informations p{
  text-align: center;
  color:#746c6c;
  font-size: 1.9rem;
  font-weight: bold;
}

.btnGroup {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.delBtn,.editBtn,.validBtn,.cancelBtn {
  margin-left: 3%;
  margin-right: 3%;
}

.delBtn button, .editBtn button, .validBtn button, .cancelBtn button {
  margin-top: 10vh;
  width: 230px;
  height: 50px;
  font-size: 1.4rem;
}

.delBtn button, .cancelBtn button {
  background-color: #FD6666;
}

.editBtn button{
  background-color: #F6DC73;
}

.validBtn button{
  background-color: #24e25d;
}

.title{
  display: flex;
  flex-direction: row;
}

.info-title{
  color:#fd4d97 !important;
}

.info-block{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
}

.radio-info-block, .info-block{
  margin-bottom: 2rem;
}

.info-block input{
  text-align: center;
  text-indent: 0 !important;
  width: 15vw !important;
  height: 2.2vh !important;
}

.info-block textarea {
  width: 15vw!important;
}

.info-line{
  display: flex;
  gap: 10px;
}

.input-half{
  height: 2.2vh !important;
  text-align: center;
}

.fast-edit-btn button{
    width: 30px;
    height: 30px;
    border-radius: 4px;
}

.fast-edit-btn{
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
}

.addPts{
  background-color: #8DEF0F;
}

.removePts{
  background-color: #FD6666;
}

.resetPts,.refreshLC{
  background-color: #F6DC73;
}

.icon{
  height: 70%;
}
</style>../tools../../public/data/dao../dao