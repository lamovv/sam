export default function buildDone(){
  return {
    name: 'build-end',
    buildEnd(){
      try{
        console.log('\n999\n');
        process.send?.({type: 'DONE'});
      }catch(e){
        console.log('buildEnd', e);
      }
    }
  }
}
