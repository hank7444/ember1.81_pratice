export default {
  name: "injectStoreIntoComponent",

  initialize: function(container, application) {

  	console.log('###init liquidFire');

	LiquidFire.map(function(){
      this.transition(
        this.fromRoute('main.index'),
        this.toRoute('main.companyList2'),
        this.use('toLeft'),
        this.reverse('toRight')
      );
      this.transition(
        this.fromRoute('main.companyList2'),
        this.toRoute('main.companyDetail2'),
        this.use('toLeft'),
        this.reverse('toRight')
      );
    });
  }
};