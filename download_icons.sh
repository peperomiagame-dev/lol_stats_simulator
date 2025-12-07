#!/bin/bash
mkdir -p src/assets/stats
curl -L -o src/assets/stats/attack_damage.png "https://static.wikia.nocookie.net/leagueoflegends/images/7/7e/Attack_damage_colored_icon.png"
curl -L -o src/assets/stats/ability_power.png "https://static.wikia.nocookie.net/leagueoflegends/images/0/0a/Ability_power_colored_icon.png"
curl -L -o src/assets/stats/armor.png "https://static.wikia.nocookie.net/leagueoflegends/images/d/d5/Armor_colored_icon.png"
curl -L -o src/assets/stats/magic_resist.png "https://static.wikia.nocookie.net/leagueoflegends/images/a/a3/Magic_resistance_colored_icon.png"
curl -L -o src/assets/stats/attack_speed.png "https://static.wikia.nocookie.net/leagueoflegends/images/4/49/Attack_speed_colored_icon.png"
curl -L -o src/assets/stats/ability_haste.png "https://static.wikia.nocookie.net/leagueoflegends/images/f/fc/Ability_haste_colored_icon.png"
curl -L -o src/assets/stats/crit_chance.png "https://static.wikia.nocookie.net/leagueoflegends/images/3/3e/Critical_strike_chance_colored_icon.png"
curl -L -o src/assets/stats/move_speed.png "https://static.wikia.nocookie.net/leagueoflegends/images/2/21/Movement_speed_colored_icon.png"
curl -L -o src/assets/stats/armor_pen.png "https://static.wikia.nocookie.net/leagueoflegends/images/6/64/Armor_penetration_colored_icon.png"
curl -L -o src/assets/stats/magic_pen.png "https://static.wikia.nocookie.net/leagueoflegends/images/f/f8/Magic_penetration_colored_icon.png"
curl -L -o src/assets/stats/lifesteal.png "https://static.wikia.nocookie.net/leagueoflegends/images/6/6b/Life_steal_colored_icon.png"
curl -L -o src/assets/stats/omnivamp.png "https://static.wikia.nocookie.net/leagueoflegends/images/a/a7/Omnivamp_colored_icon.png"
curl -L -o src/assets/stats/health.png "https://static.wikia.nocookie.net/leagueoflegends/images/2/22/Health_colored_icon.png"
curl -L -o src/assets/stats/mana.png "https://static.wikia.nocookie.net/leagueoflegends/images/d/d1/Mana_colored_icon.png"
curl -L -o src/assets/stats/health_regen.png "https://static.wikia.nocookie.net/leagueoflegends/images/a/a9/Health_regeneration_colored_icon.png"
curl -L -o src/assets/stats/mana_regen.png "https://static.wikia.nocookie.net/leagueoflegends/images/5/50/Mana_regeneration_colored_icon.png"
curl -L -o src/assets/stats/lethality.png "https://static.wikia.nocookie.net/leagueoflegends/images/6/64/Armor_penetration_colored_icon.png"
curl -L -o src/assets/stats/tenacity.png "https://static.wikia.nocookie.net/leagueoflegends/images/c/c9/Tenacity_colored_icon.png"
# Range icon guessed or found? I'll use a generic one or try to find it. 
# Search result didn't show it? 
# I will use a placeholder or generic if this fails, but curl will just save the 404 page if not careful.
# Adding -f to fail on error.
curl -f -L -o src/assets/stats/range.png "https://static.wikia.nocookie.net/leagueoflegends/images/2/22/Range_icon.png" || echo "Range icon not found"
echo "Done"
