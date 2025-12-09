function doPost(e) {
  try {
    // Get all parameters
    const params = e.parameter;
    
    // Prepare data for spreadsheet
    const timestamp = new Date().toLocaleString();
    const sheetData = prepareSheetData(params, timestamp);
    
    // Get or create spreadsheet
    const spreadsheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
    let sheet = spreadsheet.getSheetByName('Submissions');
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Submissions');
      // Add headers
      const headers = Object.keys(sheetData);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Add new row
    const lastRow = sheet.getLastRow();
    const rowData = Object.values(sheetData);
    sheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
    
    // Send email notification
    sendEmailNotification(params, timestamp);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function prepareSheetData(params, timestamp) {
  // Create a flat object for spreadsheet
  const sheetData = {
    'Timestamp': timestamp,
    'Submission_Date': params.submission_date || timestamp,
    'Full_Name': params.fullname || '',
    'Email': params.email || '',
    'Phone': params.phone || '',
    'Country': params.country || '',
    'Age': params.age || '',
    'Profession': params.occupation || '',
    'Marital_Status': params.marital_status || '',
    'Children': params.children || '',
    'Height': params.height || '',
    'Skin_Tone': params.skin_tone || '',
    'WhatsApp': params.whatsapp || '',
    'TikTok': params.social_media || '',
    'Contact_Preference': params.contact_preference || '',
    'Deal_Breakers': params.deal_breakers || '',
    'Love_Languages': params.love_languages || '',
    'Marriage_Preference': params.marriage_preference || '',
    'Communication_Style': params.communication_style || '',
    'Relationship_Perspective': params.relationship_perspective || '',
    'Core_Values': params.core_values || '',
    'Religion': params.religion || '',
    'Spiritual_Practice': params.spiritual_practice || '',
    'Personality_Type': params.personality_type || '',
    'Social_Archetype': params.social_archetype || '',
    'Jungian_Types': params.jungian_types || '',
    'Cognitive_Dissonance': params.cognitive_dissonance || '',
    'Love_For_Children': params.love_for_children || '',
    'Desired_Children': params.desired_children || '',
    'Emotional_State': params.emotional_state || '',
    'Phobias': params.phobias || '',
    'Zodiac_Sign': params.zodiac_sign || '',
    'Astrology_Belief': params.astrology_belief || '',
    'Soulmate_Belief': params.soulmate_belief || '',
    'Aura_Type': params.aura_type || '',
    'Time_With_Partner': params.time_with_partner || '',
    'Marry_With_Children': params.marry_with_children || '',
    'Past_Matters': params.past_matters || '',
    'Partner_Skin_Tone': params.partner_skin_tone || '',
    'Partner_Age_Range': params.partner_age_range || '',
    'Partner_Hair_Color': params.partner_hair_color || '',
    'Partner_Eye_Color': params.partner_eye_color || '',
    'Partner_Fashion_Sense': params.partner_fashion_sense || '',
    'Partner_Voice_Tone': params.partner_voice_tone || '',
    'Partner_Body_Type': params.partner_body_type || '',
    'Partner_Height_Range': params.partner_height_range || '',
    'Partner_Personality_Traits': params.partner_personality_traits || '',
    'Partner_Intro_Extro': params.partner_intro_extro || '',
    'Partner_Playful_Serious': params.partner_playful_serious || '',
    'Partner_Leader_Supportive': params.partner_leader_supportive || '',
    'Partner_Attractive_Features': params.partner_attractive_features || '',
    'Partner_Lifestyle': params.partner_lifestyle || '',
    'Partner_Health_Fitness': params.partner_health_fitness || '',
    'Partner_Travel': params.partner_travel || '',
    'Partner_Sleep_Schedule': params.partner_sleep_schedule || '',
    'Partner_Planning_Style': params.partner_planning_style || '',
    'Partner_Relationship_Dynamic': params.partner_relationship_dynamic || '',
    'Partner_Attachment_Style': params.partner_attachment_style || '',
    'Partner_Communication_Frequency': params.partner_communication_frequency || '',
    'Partner_Emotional_Expression': params.partner_emotional_expression || '',
    'Partner_Conflict_Style': params.partner_conflict_style || '',
    'Relationship_Timeline': params.relationship_timeline || '',
    'Long_Distance_Thoughts': params.long_distance_thoughts || '',
    'Relocate_For_Love': params.relocate_for_love || '',
    'Partner_Financial_Stability': params.partner_financial_stability || '',
    'User_Agent': params.user_agent || '',
    'Screen_Resolution': params.screen_resolution || ''
  };
  
  return sheetData;
}

function sendEmailNotification(params, timestamp) {
  const recipient = params.to || 'bjerrykibs@gmail.com';
  const subject = params.subject || 'New Love Match Questionnaire Submission';
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e91e63, #9c27b0); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #e91e63; }
        .label { font-weight: bold; color: #e91e63; }
        .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ New Love Match Submission</h1>
          <p>Submitted on: ${timestamp}</p>
        </div>
        <div class="content">
          <div class="section">
            <h3>👤 Personal Information</h3>
            <p><span class="label">Name:</span> ${params.fullname || 'Not provided'}</p>
            <p><span class="label">Email:</span> ${params.email || 'Not provided'}</p>
            <p><span class="label">Phone:</span> ${params.phone || 'Not provided'}</p>
            <p><span class="label">Age:</span> ${params.age || 'Not provided'}</p>
            <p><span class="label">Country:</span> ${params.country || 'Not provided'}</p>
          </div>
          
          <div class="section">
            <h3>💖 Relationship Preferences</h3>
            <p><span class="label">Deal Breakers:</span> ${params.deal_breakers || 'Not provided'}</p>
            <p><span class="label">Love Languages:</span> ${params.love_languages || 'Not provided'}</p>
            <p><span class="label">Marriage Preference:</span> ${params.marriage_preference || 'Not provided'}</p>
          </div>
          
          <div class="section">
            <h3>🌟 Ideal Partner</h3>
            <p><span class="label">Aura Type:</span> ${params.aura_type || 'Not selected'}</p>
            <p><span class="label">Desired Traits:</span> ${params.partner_personality_traits || 'Not specified'}</p>
          </div>
        </div>
        <div class="footer">
          <p>This submission has been saved to Google Sheets</p>
          <p>© ${new Date().getFullYear()} Love Match Questionnaire</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody
  });
}