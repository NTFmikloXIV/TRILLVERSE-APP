import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import { configured, supabase } from './src/lib/supabase';

type Audience = 'only_me' | 'followers' | 'public';
const LABELS: Record<Audience, string> = { only_me: 'Only me', followers: 'Followers', public: 'Everyone in this test' };

export default function App() {
  const [session, setSession] = useState<Session|null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [draft, setDraft] = useState('');
  const [audience, setAudience] = useState<Audience>('only_me');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({data}) => {setSession(data.session);setLoading(false);});
    const {data} = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn() {
    if (!supabase) return;
    setSending(true);
    const {error} = await supabase.auth.signInWithPassword({email: email.trim(), password});
    setSending(false);
    if(error) Alert.alert('Sign in failed', error.message);
  }
  async function publish() {
    if (!supabase) return;
    const body=draft.trim();
    if (!body || Array.from(body).length > 280) return Alert.alert('Check your text','Enter 1–280 characters.');
    setSending(true);
    const {error} = await supabase.rpc('publish_text_post', {p_body:body, p_audience:audience});
    setSending(false);
    if(error) { setStatus('Publishing blocked: '+error.message); return; }
    setDraft('');setStatus('Post accepted by backend.');
  }

  return <SafeAreaView style={styles.page}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.logo}>✦ Trill<Text style={{color:'#c37cff'}}>Verse</Text></Text>
    <Text style={styles.sub}>PERSONAL DIGITAL UNIVERSE · ENGINEERING SLICE</Text>
    <View style={styles.box}><Text style={styles.h}>🔐 Backend-first prototype</Text><Text style={styles.p}>This build deliberately disables general sign-up. Your account must be explicitly admitted by an approved backend process, which is not implemented here.</Text></View>
    {!configured ? <View style={styles.box}><Text style={styles.h}>Setup required</Text><Text style={styles.p}>Copy .env.example to .env and provide a test Supabase URL and publishable key. Never include the service role key in the app.</Text></View> : loading ? <ActivityIndicator color="#bd82ff"/> : !session ? <View style={styles.box}><Text style={styles.h}>Sign in</Text><TextInput style={styles.input} placeholder="Email" placeholderTextColor="#87789e" autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} value={email}/><TextInput style={styles.input} placeholder="Password" placeholderTextColor="#87789e" secureTextEntry onChangeText={setPassword} value={password}/><TouchableOpacity style={styles.button} disabled={sending} onPress={signIn}><Text style={styles.buttonText}>Sign in</Text></TouchableOpacity></View> : <>
    <View style={styles.box}><Text style={styles.h}>✦ Your account</Text><Text style={styles.p}>{session.user.email}</Text><TouchableOpacity onPress={()=>supabase?.auth.signOut()}><Text style={styles.link}>Sign out</Text></TouchableOpacity></View>
    <View style={styles.box}><Text style={styles.h}>New transmission</Text><TextInput multiline style={[styles.input,{minHeight:115,textAlignVertical:'top'}]} placeholder="What's happening in your universe?" placeholderTextColor="#87789e" value={draft} onChangeText={setDraft}/><Text style={styles.p}>{Array.from(draft.trim()).length}/280 characters</Text><Text style={styles.h}>Audience</Text><View style={styles.row}>{(Object.keys(LABELS) as Audience[]).map(a=><TouchableOpacity key={a} onPress={()=>setAudience(a)} style={[styles.chip,audience===a&&styles.selected]}><Text style={styles.chipText}>{LABELS[a]}</Text></TouchableOpacity>)}</View><Text style={styles.p}>{audience==='only_me'?'Only your authenticated account may read this post.':audience==='followers'?'Your account and accepted followers only. Pending followers are excluded.':'Active, admitted testers can read it; signed-out users cannot.'}</Text><Text style={styles.h}>Preview</Text><View style={styles.preview}><Text style={styles.p}>✦ You · {LABELS[audience]}</Text><Text style={styles.previewText}>{draft.trim()||'Your post preview appears here…'}</Text></View><TouchableOpacity style={styles.button} onPress={publish} disabled={sending}><Text style={styles.buttonText}>{sending?'Sending…':'Publish through RPC'}</Text></TouchableOpacity>{!!status&&<Text accessibilityRole="alert" style={styles.p}>{status}</Text>}</View>
    </>}
    <Text style={styles.footer}>No DM service, media, public signup, or test-cohort onboarding. Database policies are an unverified engineering proposal.</Text>
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({page:{flex:1,backgroundColor:'#0a0717'},content:{padding:19,paddingBottom:40},logo:{fontSize:29,fontWeight:'900',color:'white',marginTop:8},sub:{fontSize:9,letterSpacing:2,color:'#baa8db',marginTop:2,marginBottom:20},box:{backgroundColor:'#1a1230',borderColor:'#463167',borderWidth:1,borderRadius:17,padding:17,marginBottom:16},h:{color:'#f5eaff',fontSize:16,fontWeight:'800',marginBottom:11},p:{color:'#bcacd3',fontSize:12,lineHeight:19,marginBottom:10},input:{backgroundColor:'#100b21',borderWidth:1,borderColor:'#4b3b66',borderRadius:11,padding:13,color:'white',marginBottom:12},button:{backgroundColor:'#873eda',borderRadius:12,padding:14,alignItems:'center',marginTop:8},buttonText:{color:'white',fontWeight:'800'},link:{color:'#ce95ff',marginTop:8,fontWeight:'700'},row:{flexDirection:'row',flexWrap:'wrap',gap:7},chip:{backgroundColor:'#261a40',padding:10,borderRadius:12,borderWidth:1,borderColor:'#493465'},selected:{backgroundColor:'#6331ab',borderColor:'#b880ff'},chipText:{color:'white',fontSize:11},preview:{backgroundColor:'#0e0a1e',borderWidth:1,borderColor:'#403055',padding:14,borderRadius:11,marginVertical:10},previewText:{color:'white',fontSize:14},footer:{textAlign:'center',color:'#988aaa',fontSize:11,lineHeight:18,marginTop:5}});
