import React, { useEffect, useState } from 'react';
// components
import PageHeader from '@layout/PageHeader';
import AppGrid from '@layout/AppGrid';
import TeamStats from '@widgets/TeamStats';
import Points from '@widgets/Points';
import Attendance from '@widgets/Attendance';
import TrainingPaceChart from '@widgets/TrainingPaceChart';
import MatchLiveReport from '@widgets/MatchLiveReport';
import WidgetGroup from '@components/WidgetGroup';
import TeamFullInfo from '@widgets/TeamFullInfo';
import TeamResults from '@widgets/TeamResults';
import LeagueStandings from '@widgets/LeagueStandings';
import { supabase } from '../hooks/useSuperbaseQuery.js';
import { getUser } from '../hooks/useSuperbaseAuth.js';
import { fetchTeamByName } from '../hooks/useSerpAPI.js'; // Adjust the path as needed

const ClubSummary = () => {
    const [user, setUser] = useState(null);
    const [club, setClub] = useState(null);
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const widgets = {
        team_stats: <TeamStats/>,
        attendance:
            <WidgetGroup>
                <Points/>
                <Attendance/>
            </WidgetGroup>
        ,
        training_pace: <TrainingPaceChart/>,
        live_report: <MatchLiveReport/>,
        team_full_info: <TeamFullInfo id="bayern"/>,
        team_results: <TeamResults/>,
        league_standings: <LeagueStandings/>
    }

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const userData = await getUser();
            console.log("getting user's info", userData);
            setUser(userData);
            // getting profile
            const { data, error } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', userData.id);

            if (error) {
                error(data);
            } else {
                console.log(data);
                setUser(data[0]);
            }
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchClub = async () => {
            setLoading(true);
            try {
                // getting club
                const { data, error } = await supabase
                    .from('clubs')
                    .select('*')
                    .eq('id', user.club_id);

                if (error) {
                    error(data);
                } else {
                    console.log('user has this club selected: ', data);
                    setClub(data[0]);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.club_id){
            fetchClub();
        }
    }, [user?.club_id]);

    useEffect(() => {
        const statsClub = async () => {
            setLoading(true);
            try {
                // getting club
                const { data, error } = await supabase
                    .from('clubs')
                    .select('*')
                    .eq('id', user.club_id);

                if (error) {
                    error(data);
                } else {
                    console.log('user has this club selected: ', data[0]);
                    setClub(data[0]);
                    // get team stats
                    console.log('getting team stats: ', new Date().getFullYear(), data[0].football_api_id);
                    fetchTeamByName('Manchester United F.C.').then(team =>{
                        console.log('team stats: ', team);
                        setTeam(team);
                    })
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (club?.id){
            statsClub();
        }
    }, [club?.id]);

    // Handle loading and error states for both user and user profile
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching: {error.message}</p>;
    
    return (
        <>
            <PageHeader title="Club summary"/>
            <AppGrid id="club_summary" widgets={widgets}/>
        </>
    )
}

export default ClubSummary